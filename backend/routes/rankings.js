import express from "express";
import { Follow } from "../models/follow.js";
import { Stock } from "../models/stock.js";

const router = express.Router();

const checkSession = (req, res, next) => {
    const user = req.session.user;
    if (!user) {
        res.status(401).json({ error: "Missing Session." });
    } else {
        next();
    }
};

router.use(checkSession);

router.get("/ranking", async (req, res) => {
    const user = req.session.user;

    try {
        const follows = await Follow.findAll({
            where: { UserId: user.id },
            include: [{ model: Stock }]
        });

        const stocksYouFollow = follows.length === 0 ? [] : follows.map((follow) => follow.Stock);

        const stocksInDatabase = await Stock.findAll();

        if (stocksInDatabase.length < 10) {
            res.status(422).json({
                error: "You need at least 10 stocks in the database to access ranking."
            });
        }

        const randomStocksNeeded = 10 - stocksYouFollow.length;

        const stocksRanking = [...stocksYouFollow];

        for (let i = 0; i < randomStocksNeeded; i++) {
            let potentialStock;
            let alreadyInRanking;

            do {
                const randomIndex = Math.floor(
                    Math.random() * stocksInDatabase.length
                );
                potentialStock = stocksInDatabase[randomIndex];

                alreadyInRanking = stocksRanking.some(
                    (stock) => stock.name === potentialStock.name
                );
            } while (alreadyInRanking);

            stocksRanking.push(potentialStock);
        }

        res.status(200).json({ stocksRanking });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
