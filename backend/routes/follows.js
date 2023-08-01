import express from "express";
import { Follow } from "../models/follow.js";
import { Stock } from "../models/stock.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/follows/stock/:ticker", async (req, res) => {
    const { ticker } = req.params;

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in database."
            });
            return;
        }

        const follows = await Follow.findAll({
            where: { StockId: stock.id },
            include: [{ model: User }]
        });

        res.status(200).json({ follows });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/follows/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ where: { username } });

        if (user === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }

        const follows = await Follow.findAll({
            where: { UserId: user.id },
            include: [{ model: Stock }]
        });

        const stocksYouFollow = follows.map((follow) => follow.Stock);

        res.status(200).json({ stocksYouFollow });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/follow", async (req, res) => {
    const { user } = req.session;
    const ticker = req.body.ticker?.toUpperCase();

    if (ticker == null) {
        res.status(400).json({ error: "Invalid request body." });
        return;
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in database."
            });
            return;
        }

        const followData = {
            UserId: user.id,
            StockId: stock.id
        };

        const follow = await Follow.findOne({ where: followData });

        if (follow !== null) {
            res.status(409).json({
                error: "This user already follows this stock."
            });
            return;
        }

        const newFollow = await Follow.create(followData);

        res.status(200).json({ follow: newFollow });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/unfollow", async (req, res) => {
    const { user } = req.session;
    const ticker = req.body.ticker?.toUpperCase();

    if (ticker == null) {
        res.status(400).json({ error: "Invalid request body." });
        return;
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in database."
            });
            return;
        }

        const followData = {
            UserId: user.id,
            StockId: stock.id
        };

        const follow = await Follow.findOne({ where: followData });

        if (follow === null) {
            res.status(409).json({
                error: "This user does not follow this stock."
            });
            return;
        }

        await follow.destroy();

        res.status(200).json({ follow });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
