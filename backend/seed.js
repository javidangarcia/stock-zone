import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
import { Stock } from "./models/stock.js";
import { Like } from "./models/like.js";
import { Dislike } from "./models/dislike.js";
import { Follow } from "./models/follow.js";
import { Friend } from "./models/friend.js";
import { Comment } from "./models/comment.js";
import { Post } from "./models/post.js";
import { PostComment } from "./models/postComment.js";
import { sequelize } from "./database.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const userData = JSON.parse(
    fs.readFileSync(path.resolve(dirname, "./seeders/users.json"), "utf8")
);

const stockData = JSON.parse(
    fs.readFileSync(path.resolve(dirname, "./seeders/stocks.json"), "utf8")
);

const generateRandomStockComment = (numUsers, numStocks) => {
    const contentOptions = [
        "Great company!",
        "Interesting stock to watch.",
        "Not sure about this one.",
        "Seems like a solid investment.",
        "I've heard mixed reviews.",
        "High risk, high reward.",
        "Definitely worth considering.",
        "Not on my radar.",
        "Hoping for good earnings."
    ];

    return {
        content:
            contentOptions[Math.floor(Math.random() * contentOptions.length)],
        UserId: Math.floor(Math.random() * numUsers) + 1,
        StockId: Math.floor(Math.random() * numStocks) + 1
    };
};

const generateFixedPosts = (numUsers) => {
    const postsData = [
        {
            title: "Analyzing Market Trends",
            content: `As the stock market continues to experience volatility, it's crucial for investors to stay informed about the latest market trends and shifts. In this post, I'll delve into the factors driving recent market movements and share insights on potential investment opportunities. From macroeconomic indicators to sector-specific developments, we'll explore the key drivers shaping the market landscape.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        },
        {
            title: "Strategies for Portfolio Diversification",
            content: `Portfolio diversification is a cornerstone of effective risk management in investing. In this article, I'll discuss various strategies for achieving a well-diversified portfolio. From asset allocation and sector exposure to geographic diversification, we'll explore practical steps to reduce risk and enhance potential returns.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        },
        {
            title: "Evaluating Earnings Reports",
            content: `Earnings reports play a crucial role in stock analysis and decision-making. In this comprehensive guide, I'll walk you through the process of evaluating earnings reports, including key metrics such as revenue, earnings per share (EPS), and profit margins. We'll also discuss the importance of forward guidance and how earnings reports can impact stock prices.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        },
        {
            title: "Navigating Volatile Markets",
            content: `Market volatility is an inherent part of investing, and understanding how to navigate turbulent markets is essential for long-term success. In this post, I'll share strategies for managing investments during periods of heightened volatility. From setting stop-loss orders to identifying opportunities amid market swings, we'll explore ways to stay resilient in the face of uncertainty.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        },
        {
            title: "The Role of Interest Rates in Stock Valuation",
            content: `Interest rates exert a significant influence on stock valuations and market dynamics. In this insightful article, I'll delve into the relationship between interest rates and stock prices. We'll explore how changes in interest rates impact different sectors, the concept of discount rates in valuation models, and considerations for investors in a changing rate environment.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        },
        {
            title: "Identifying Promising Growth Stocks",
            content: `Identifying growth stocks with strong potential is a goal for many investors. In this post, I'll outline a systematic approach to identifying promising growth stocks. From assessing revenue growth and market share expansion to analyzing competitive advantages, we'll cover the key criteria to consider when evaluating stocks for long-term growth.`,
            UserId: Math.floor(Math.random() * numUsers) + 1
        }
    ];

    return postsData;
};

const generateRandomPostComment = (numUsers, numPosts) => {
    const contents = [
        "Great post! Thanks for sharing your insights.",
        "I found this analysis very informative.",
        "Interesting perspective. I agree with your points.",
        "Could you elaborate more on this topic?",
        "I have a different viewpoint on this issue.",
        "Looking forward to your next post!"
    ];

    return {
        content: contents[Math.floor(Math.random() * contents.length)],
        UserId: Math.floor(Math.random() * numUsers) + 1,
        PostId: Math.floor(Math.random() * numPosts) + 1
    };
};

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        const usersWithHashedPasswords = await Promise.all(
            userData.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );

        const createdUsers = await User.bulkCreate(usersWithHashedPasswords);
        console.log("User data has been seeded!");

        const createdStocks = await Stock.bulkCreate(stockData);
        console.log("Stock data has been seeded!");

        const postsData = generateFixedPosts(createdUsers.length);

        const createdPosts = await Post.bulkCreate(postsData);
        console.log("Post data has been seeded!");

        const numPostCommentsToGenerate = 100;
        const postCommentsData = Array.from(
            { length: numPostCommentsToGenerate },
            () =>
                generateRandomPostComment(
                    createdUsers.length,
                    createdPosts.length
                )
        );

        await PostComment.bulkCreate(postCommentsData);
        console.log("PostComment data has been seeded!");

        const numCommentsToGenerate = 300;
        const commentsData = Array.from({ length: numCommentsToGenerate }, () =>
            generateRandomStockComment(
                createdUsers.length,
                createdStocks.length
            )
        );

        await Comment.bulkCreate(commentsData);
        console.log("Comment data has been seeded!");

        const likeRelationships = [];
        const dislikeRelationships = [];
        const followRelationships = [];
        const friendRelationships = new Set();

        createdUsers.forEach((user) => {
            const numStocksToLike = Math.floor(
                Math.random() * (createdStocks.length + 1)
            );
            const numStocksToDislike = Math.floor(
                Math.random() * (createdStocks.length + 1)
            );
            const numStocksToFollow = Math.floor(
                Math.random() * (createdStocks.length + 1)
            );
            const numFriends = Math.floor(
                Math.random() * (createdUsers.length - 1)
            );

            const randomStocks = [...createdStocks];
            const randomUsers = [...createdUsers];

            for (let i = randomStocks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [randomStocks[i], randomStocks[j]] = [
                    randomStocks[j],
                    randomStocks[i]
                ];
            }

            for (let i = randomUsers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [randomUsers[i], randomUsers[j]] = [
                    randomUsers[j],
                    randomUsers[i]
                ];
            }

            const stocksToLike = randomStocks.slice(0, numStocksToLike);
            const stocksToDislike = randomStocks.slice(0, numStocksToDislike);
            const stocksToFollow = randomStocks.slice(0, numStocksToFollow);
            const friends = randomUsers
                .filter((randomUser) => randomUser.id !== user.id)
                .slice(0, numFriends);

            stocksToLike.forEach((stock) => {
                likeRelationships.push({
                    UserId: user.id,
                    StockId: stock.id
                });
            });

            stocksToDislike.forEach((stock) => {
                dislikeRelationships.push({
                    UserId: user.id,
                    StockId: stock.id
                });
            });

            stocksToFollow.forEach((stock) => {
                followRelationships.push({
                    UserId: user.id,
                    StockId: stock.id
                });
            });

            friends.forEach((friend) => {
                const relationshipKey1 = `${user.id}-${friend.id}`;
                const relationshipKey2 = `${friend.id}-${user.id}`;

                friendRelationships.add(relationshipKey1);
                friendRelationships.add(relationshipKey2);
            });
        });

        const friendRelationshipsArray = Array.from(friendRelationships).map((relationshipKey) => {
            const [UserId1, UserId2] = relationshipKey.split('-');
            return {
                UserId1: parseInt(UserId1),
                UserId2: parseInt(UserId2)
            };
        });

        await Like.bulkCreate(likeRelationships);
        console.log("Like relationships have been seeded!");

        await Dislike.bulkCreate(dislikeRelationships);
        console.log("Dislike relationships have been seeded!");

        await Follow.bulkCreate(followRelationships);
        console.log("Follow relationships have been seeded!");

        await Friend.bulkCreate(friendRelationshipsArray);
        console.log("Friend relationships have been seeded!");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
