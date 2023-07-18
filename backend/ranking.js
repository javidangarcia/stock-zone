import { Stock } from "./models/stock.js";
import { Follow } from "./models/follow.js";
import { Like } from "./models/like.js";
import { Dislike } from "./models/dislike.js";
import { compareStocksByPoints } from "./utils.js";


const FOLLOW_POINTS = 25;
const LIKE_POINTS = 20;
const DISLIKE_POINTS = -20;


export async function RankingOptimized(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes] = await Promise.all([
            Stock.findAll(),
            Follow.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            }),
            Like.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            }),
            Dislike.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            })
        ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking."
            };
        }

        const followsMap = {};

        follows.forEach((follow) => {
            followsMap[follow.Stock.ticker] = true;
        });

        const likesMap = {};

        likes.forEach((like) => {
            likesMap[like.Stock.ticker] = true;
        });

        const dislikesMap = {};

        dislikes.forEach((dislike) => {
            dislikesMap[dislike.Stock.ticker] = true;
        });

        const stocksRanking = stocksInDatabase.map((currentStock) => {
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


export async function RankingVersion1(user) {
    try {
        const [stocksInDatabase, follows, likes, dislikes] = await Promise.all([
            Stock.findAll(),
            Follow.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            }),
            Like.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            }),
            Dislike.findAll({
                where: { UserId: user.id },
                include: [{ model: Stock }]
            })
        ]);

        if (stocksInDatabase.length < 10) {
            return {
                status: 422,
                error: "You need at least 10 stocks in the database to access ranking."
            };
        }

        const stocksYouFollow = follows.map((follow) => follow.Stock);
        const stocksYouLike = likes.map((like) => like.Stock);
        const stocksYouDislike = dislikes.map((dislike) => dislike.Stock);

        const stocksRanking = [];

        stocksInDatabase.forEach((currentStock) => {
            let points = 0;

            const selectedStockYouFollow = stocksYouFollow.find(
                (stock) => stock.ticker === currentStock.ticker
            );

            if (selectedStockYouFollow != null) {
                points += FOLLOW_POINTS;
            }

            const selectedStockYouLike = stocksYouLike.find(
                (stock) => stock.ticker === currentStock.ticker
            );

            if (selectedStockYouLike != null) {
                points += LIKE_POINTS;
            }

            const selectedStockYouDislike = stocksYouDislike.find(
                (stock) => stock.ticker === currentStock.ticker
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
