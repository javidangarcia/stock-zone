import express from "express";
import { Follow } from "../models/follow.js";
import { Stock } from "../models/stock.js";
import { Like } from "../models/like.js";
import { Dislike } from "../models/dislike.js";
import { compareStocksByPoints } from "../utils.js";

const FOLLOW_POINTS = 25;
const LIKE_POINTS = 20;
const DISLIKE_POINTS = -20;

const router = express.Router();

router.get("/ranking", async (req, res) => {
    const user = req.session.user;

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
            res.status(422).json({
                error: "You need at least 10 stocks in the database to access ranking."
            });
        }

        const stocksYouFollow = follows.map((follow) => follow.Stock);
        const stocksYouLike = likes.map((like) => like.Stock);
        const stocksYouDislike = dislikes.map((dislike) => dislike.Stock);

        const stocksRanking = [];

        stocksInDatabase.forEach((currentStock) => {
            let points = 0;

            const selectedStockYouFollow = stocksYouFollow.find((stock) => stock.ticker === currentStock.ticker);

            if (selectedStockYouFollow != null) {
                points += FOLLOW_POINTS;
            }

            const selectedStockYouLike = stocksYouLike.find((stock) => stock.ticker === currentStock.ticker);

            if (selectedStockYouLike != null) {
                points += LIKE_POINTS;
            }

            const selectedStockYouDislike = stocksYouDislike.find((stock) => stock.ticker === currentStock.ticker);

            if (selectedStockYouDislike != null) {
                points += DISLIKE_POINTS;
            }

            const { ticker, name, logo } = currentStock.dataValues;
            const stockWithPoints = { ticker, name, logo, points }

            stocksRanking.push(stockWithPoints);
        });

        stocksRanking.sort(compareStocksByPoints);
        const topTenStocks = stocksRanking.slice(0, 10);

        return res.status(200).json({ stocksRanking: topTenStocks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

export default router;
