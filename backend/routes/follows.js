import express from "express";
import { Follow } from "../models/follow.js";
import { Stock } from "../models/stock.js";

const router = express.Router();

router.get("/follows", async (req, res) => {
    const user = req.session.user;

    try {
        const follows = await Follow.findAll({
            where: { UserId: user.id },
            include: [{ model: Stock }]
        });

        if (follows.length === 0) {
            res.status(404).json({ error: "This user doesn't follow any stocks." });
            return;
        }

        const stocks = follows.map((follow) => follow.Stock);

        res.status(200).json({ stocks });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/follow", async (req, res) => {
    const user = req.session.user;
    const ticker = req.body.ticker?.toUpperCase();

    if (ticker == null) {
        res.status(400).json({ error: "Invalid request body." });
        return;
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({ error: "This stock does not exist in database." });
            return;
        }

        const followData = {
            UserId: user.id,
            StockId: stock.id
        };

        const follow = await Follow.findOne({ where: followData });

        if (follow !== null) {
            res.status(409).json({ error: "This user already follows this stock." });
            return;
        }

        const newFollow = await Follow.create(followData);

        res.status(200).json({ follow: newFollow });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/unfollow", async (req, res) => {
    const user = req.session.user;
    const ticker = req.body.ticker?.toUpperCase();

    if (ticker == null) {
        res.status(400).json({ error: "Invalid request body." });
        return;
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({ error: "This stock does not exist in database." });
            return;
        }

        const followData = {
            UserId: user.id,
            StockId: stock.id
        };

        const follow = await Follow.findOne({ where: followData });

        if (follow === null) {
            res.status(409).json({ error: "This user does not follow this stock." });
            return;
        }

        await follow.destroy();

        res.status(200).json({ follow });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
