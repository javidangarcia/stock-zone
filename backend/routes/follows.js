import express from "express";
import { Follow } from "../models/follow.js";
import { Stock } from "../models/stock.js";

const router = express.Router();

router.get("/follows", async (req, res) => {
    const user = req.session.user;

    const follows = await Follow.findAll({
        where: { UserId: user.id },
        include: [{ model: Stock }]
    });

    const stocks = follows.map((follow) => follow.Stock);

    res.status(200).json({ stocks });
});

router.post("/follow", async (req, res) => {
    const ticker = req.body.ticker.toUpperCase();

    const user = req.session.user;
    const stock = await Stock.findOne({ where: { ticker } });

    const followData = {
        UserId: user.id,
        StockId: stock.id
    };

    try {
        const follow = await Follow.create(followData);
        res.status(200).json({ follow });
    } catch (error) {
        res.status(409).json({ error: "You already follow this stock." });
    }
});

router.post("/unfollow", async (req, res) => {
    const ticker = req.body.ticker.toUpperCase();

    const user = req.session.user;
    const stock = await Stock.findOne({ where: { ticker } });

    const followData = {
        UserId: user.id,
        StockId: stock.id
    };

    const follow = await Follow.findOne({ where: followData });

    if (follow) {
        await follow.destroy();
        res.status(200).json({ follow });
    } else {
        res.status(404).json({ error: "You are not following this stock." });
    }
});

export default router;
