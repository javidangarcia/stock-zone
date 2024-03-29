import { pool } from "../db/db.js";

const FOLLOW_POINTS = 25;
const LIKE_POINTS = 20;
const DISLIKE_POINTS = -20;
const FOLLOW_FRIEND_POINTS = 10;
const LIKE_FRIEND_POINTS = 10;
const DISLIKE_FRIEND_POINTS = -10;

const compareStocksByPoints = (firstStock, secondStock) => {
    return secondStock.points - firstStock.points;
};

export async function RankingAlgorithmV5(userId) {
    try {
        const [
            stocksInDatabase,
            stocksYouFollow,
            stocksYouLike,
            stocksYouDislike,
            stocksThatFriendsFollow,
            stocksThatFriendsLike,
            stocksThatFriendsDislike
        ] = await Promise.all([
            pool.query("SELECT * FROM stocks"),
            pool.query(
                `SELECT stocks.* FROM stocks 
                 INNER JOIN follows 
                 ON stocks.id = follows.stockid 
                 WHERE follows.userid = $1`,
                [userId]
            ),
            pool.query(
                `SELECT stocks.* FROM stocks 
                 INNER JOIN likes 
                 ON stocks.id = likes.stockid 
                 WHERE likes.userid = $1`,
                [userId]
            ),
            pool.query(
                `SELECT stocks.* FROM stocks 
                 INNER JOIN dislikes 
                 ON stocks.id = dislikes.stockid 
                 WHERE dislikes.userid = $1`,
                [userId]
            ),
            pool.query(
                `SELECT stocks.* FROM stocks
                INNER JOIN follows ON stocks.id = follows.stockid
                INNER JOIN friends ON follows.userid = friends.receiverid
                WHERE friends.senderid = $1`,
                [userId]
            ),
            pool.query(
                `SELECT stocks.* FROM stocks
                INNER JOIN likes ON stocks.id = likes.stockid
                INNER JOIN friends ON likes.userid = friends.receiverid
                WHERE friends.senderid = $1`,
                [userId]
            ),
            pool.query(
                `SELECT stocks.* FROM stocks
                INNER JOIN dislikes ON stocks.id = dislikes.stockid
                INNER JOIN friends ON dislikes.userid = friends.receiverid
                WHERE friends.senderid = $1`,
                [userId]
            )
        ]);

        const stocksYouFollowMap = stocksYouFollow.rows.reduce(
            (accum, current) => {
                return {
                    ...accum,
                    [current.ticker]: true,
                };
            },
            {}
        );

        const stocksYouLikeMap = stocksYouLike.rows.reduce((accum, current) => {
            return {
                ...accum,
                [current.ticker]: true,
            };
        }, {});

        const stocksYouDislikeMap = stocksYouDislike.rows.reduce(
            (accum, current) => {
                return {
                    ...accum,
                    [current.ticker]: true,
                };
            },
            {}
        );

        const stocksThatFriendsFollowCountMap =
            stocksThatFriendsFollow.rows.reduce((accum, current) => {
                const { ticker } = current;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            }, {});

        const stocksThatFriendsLikeCountMap = stocksThatFriendsLike.rows.reduce(
            (accum, current) => {
                const { ticker } = current;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            },
            {}
        );

        const stocksThatFriendsDislikeCountMap =
            stocksThatFriendsDislike.rows.reduce((accum, current) => {
                const { ticker } = current;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            }, {});

        const stocksRanking = stocksInDatabase.rows.map(stock => {
            const { ticker } = stock;

            let points = 0;

            if (stocksYouFollowMap[ticker]) {
                points += FOLLOW_POINTS;
            }

            if (stocksYouLikeMap[ticker]) {
                points += LIKE_POINTS;
            }

            if (stocksYouDislikeMap[ticker]) {
                points += DISLIKE_POINTS;
            }

            points +=
                (stocksThatFriendsFollowCountMap[ticker] || 0) *
                FOLLOW_FRIEND_POINTS;

            points +=
                (stocksThatFriendsLikeCountMap[ticker] || 0) *
                LIKE_FRIEND_POINTS;

            points +=
                (stocksThatFriendsDislikeCountMap[ticker] || 0) *
                DISLIKE_FRIEND_POINTS *
                (stocksThatFriendsDislikeCountMap[ticker] % 2 === 0 ? -1 : 1);

            return { ...stock, points };
        });

        stocksRanking.sort(compareStocksByPoints);

        return stocksRanking;
    } catch (error) {
        console.error(error);
        throw new Error("Error calculating stocks ranking.");
    }
}

export async function RankingAlgorithmV4(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes, connections] =
            await Promise.all([
                Stock.findAll(),
                Follow.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Like.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Dislike.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Friend.findAll({
                    where: { UserId1: user.id },
                    include: [
                        { model: User, as: "user1" },
                        {
                            model: User,
                            as: "user2",
                            include: [
                                {
                                    model: Follow,
                                    include: [{ model: Stock }],
                                },
                                {
                                    model: Like,
                                    include: [{ model: Stock }],
                                },
                                {
                                    model: Dislike,
                                    include: [{ model: Stock }],
                                },
                            ],
                        },
                    ],
                }),
            ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking.",
            };
        }

        const followsMap = follows.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const likesMap = likes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const dislikesMap = dislikes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const friendsFollowsCount = connections
            .flatMap(connection => connection.user2.Follows)
            .reduce((accum, current) => {
                const { ticker } = current.Stock;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            }, {});

        const friendsLikesCount = connections
            .flatMap(connection => connection.user2.Likes)
            .reduce((accum, current) => {
                const { ticker } = current.Stock;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            }, {});

        const friendsDislikesCount = connections
            .flatMap(connection => connection.user2.Dislikes)
            .reduce((accum, current) => {
                const { ticker } = current.Stock;
                return {
                    ...accum,
                    [ticker]: (accum[ticker] || 0) + 1,
                };
            }, {});

        const stocksRanking = stocksInDatabase.map(currentStock => {
            let points = 0;

            if (followsMap[currentStock.ticker]) {
                points += FOLLOW_POINTS;
            }

            if (likesMap[currentStock.ticker]) {
                points += LIKE_POINTS;
            }

            if (dislikesMap[currentStock.ticker]) {
                points += DISLIKE_POINTS;
            }

            if (friendsFollowsCount[currentStock.ticker]) {
                points +=
                    friendsFollowsCount[currentStock.ticker] *
                    FOLLOW_FRIEND_POINTS;
            }

            if (friendsLikesCount[currentStock.ticker]) {
                points +=
                    friendsLikesCount[currentStock.ticker] * LIKE_FRIEND_POINTS;
            }

            if (friendsDislikesCount[currentStock.ticker]) {
                points +=
                    friendsDislikesCount[currentStock.ticker] *
                    DISLIKE_FRIEND_POINTS *
                    (friendsDislikesCount[currentStock.ticker] % 2 === 0
                        ? -1
                        : 1);
            }

            const { ticker, name, logo, sector, price } =
                currentStock.dataValues;
            const stockWithPoints = {
                ticker,
                name,
                logo,
                points,
                sector,
                price,
            };

            return stockWithPoints;
        });

        stocksRanking.sort(compareStocksByPoints);

        return { status: 200, data: { stocksRanking } };
    } catch (error) {
        return { status: 500, error };
    }
}

export async function RankingAlgorithmV3(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes, connections] =
            await Promise.all([
                Stock.findAll(),
                Follow.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Like.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Dislike.findAll({
                    where: { UserId: user.id },
                    include: [{ model: Stock }],
                }),
                Friend.findAll({
                    where: { UserId1: user.id },
                    include: [
                        { model: User, as: "user1" },
                        { model: User, as: "user2" },
                    ],
                }),
            ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking.",
            };
        }

        const followsMap = follows.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const likesMap = likes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const dislikesMap = dislikes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const friendIDs = connections.map(connection => connection.user2.id);

        const stocksThatFriendsFollow = await Promise.all(
            friendIDs.map(async friendID => {
                const friendFollows = await Follow.findAll({
                    where: { UserId: friendID },
                    include: [{ model: Stock }],
                });
                const stocksTheyFollow = friendFollows.map(
                    friendFollow => friendFollow.Stock.dataValues
                );
                return stocksTheyFollow;
            })
        );

        const stocksThatFriendsLike = await Promise.all(
            friendIDs.map(async friendID => {
                const friendLikes = await Like.findAll({
                    where: { UserId: friendID },
                    include: [{ model: Stock }],
                });
                const stocksTheyLike = friendLikes.map(
                    friendLike => friendLike.Stock.dataValues
                );
                return stocksTheyLike;
            })
        );

        const stocksThatFriendsDislike = await Promise.all(
            friendIDs.map(async friendID => {
                const friendDislikes = await Dislike.findAll({
                    where: { UserId: friendID },
                    include: [{ model: Stock }],
                });
                const stocksTheyDislike = friendDislikes.map(
                    friendDislike => friendDislike.Stock.dataValues
                );
                return stocksTheyDislike;
            })
        );

        const friendsFollowsMap = {};

        stocksThatFriendsFollow.forEach(friendStocks => {
            friendStocks.forEach(stock => {
                if (friendsFollowsMap[stock.ticker]) {
                    friendsFollowsMap[stock.ticker] += 1;
                } else {
                    friendsFollowsMap[stock.ticker] = 1;
                }
            });
        });

        const friendsLikesMap = {};

        stocksThatFriendsLike.forEach(friendStocks => {
            friendStocks.forEach(stock => {
                if (friendsLikesMap[stock.ticker]) {
                    friendsLikesMap[stock.ticker] += 1;
                } else {
                    friendsLikesMap[stock.ticker] = 1;
                }
            });
        });

        const friendsDislikesMap = {};

        stocksThatFriendsDislike.forEach(friendStocks => {
            friendStocks.forEach(stock => {
                if (friendsDislikesMap[stock.ticker]) {
                    friendsDislikesMap[stock.ticker] += 1;
                } else {
                    friendsDislikesMap[stock.ticker] = 1;
                }
            });
        });

        const stocksRanking = stocksInDatabase.map(currentStock => {
            let points = 0;

            if (followsMap[currentStock.ticker]) {
                points += FOLLOW_POINTS;
            }

            if (likesMap[currentStock.ticker]) {
                points += LIKE_POINTS;
            }

            if (dislikesMap[currentStock.ticker]) {
                points += DISLIKE_POINTS;
            }

            if (friendsFollowsMap[currentStock.ticker]) {
                points +=
                    friendsFollowsMap[currentStock.ticker] *
                    FOLLOW_FRIEND_POINTS;
            }

            if (friendsLikesMap[currentStock.ticker]) {
                points +=
                    friendsLikesMap[currentStock.ticker] * LIKE_FRIEND_POINTS;
            }

            if (friendsDislikesMap[currentStock.ticker]) {
                points +=
                    friendsDislikesMap[currentStock.ticker] *
                    DISLIKE_FRIEND_POINTS *
                    (friendsDislikesMap[currentStock.ticker] % 2 === 0
                        ? -1
                        : 1);
            }

            const { ticker, name, logo, sector, price } =
                currentStock.dataValues;
            const stockWithPoints = {
                ticker,
                name,
                logo,
                points,
                sector,
                price,
            };

            return stockWithPoints;
        });

        stocksRanking.sort(compareStocksByPoints);

        return { status: 200, data: { stocksRanking } };
    } catch (error) {
        return { status: 500, error };
    }
}

export async function RankingAlgorithmV2(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes] = await Promise.all([
            Stock.findAll(),
            Follow.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
            Like.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
            Dislike.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
        ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking.",
            };
        }

        const followsMap = follows.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const likesMap = likes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const dislikesMap = dislikes.reduce(
            (accum, current) => ({
                ...accum,
                [current.Stock.ticker]: true,
            }),
            {}
        );

        const stocksRanking = stocksInDatabase.map(currentStock => {
            let points = 0;

            if (followsMap[currentStock.ticker]) {
                points += FOLLOW_POINTS;
            }

            if (likesMap[currentStock.ticker]) {
                points += LIKE_POINTS;
            }

            if (dislikesMap[currentStock.ticker]) {
                points += DISLIKE_POINTS;
            }

            const { ticker, name, logo } = currentStock.dataValues;
            const stockWithPoints = { ticker, name, logo, points };

            return stockWithPoints;
        });

        stocksRanking.sort(compareStocksByPoints);
        const topTenStocks = stocksRanking.slice(0, 10);

        return { status: 200, data: { stocksRanking: topTenStocks } };
    } catch (error) {
        return { status: 500, error };
    }
}

export async function RankingAlgorithmV1(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes] = await Promise.all([
            Stock.findAll(),
            Follow.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
            Like.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
            Dislike.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }],
            }),
        ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking.",
            };
        }

        const stocksYouFollow = follows.map(follow => follow.Stock);
        const stocksYouLike = likes.map(like => like.Stock);
        const stocksYouDislike = dislikes.map(dislike => dislike.Stock);

        const stocksRanking = [];

        stocksInDatabase.forEach(currentStock => {
            let points = 0;

            const selectedStockYouFollow = stocksYouFollow.find(
                stock => stock.ticker === currentStock.ticker
            );

            if (selectedStockYouFollow != null) {
                points += FOLLOW_POINTS;
            }

            const selectedStockYouLike = stocksYouLike.find(
                stock => stock.ticker === currentStock.ticker
            );

            if (selectedStockYouLike != null) {
                points += LIKE_POINTS;
            }

            const selectedStockYouDislike = stocksYouDislike.find(
                stock => stock.ticker === currentStock.ticker
            );

            if (selectedStockYouDislike != null) {
                points += DISLIKE_POINTS;
            }

            const { ticker, name, logo } = currentStock.dataValues;
            const stockWithPoints = { ticker, name, logo, points };

            stocksRanking.push(stockWithPoints);
        });

        stocksRanking.sort(compareStocksByPoints);
        const topTenStocks = stocksRanking.slice(0, 10);

        return { status: 200, data: { stocksRanking: topTenStocks } };
    } catch (error) {
        return { status: 500, error };
    }
}
