import express from "express";
import { Like } from "../models/like.js";
import { Stock } from "../models/stock.js";
import { Dislike } from "../models/dislike.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/likes/stock/:ticker", async (req, res) => {
    const { ticker } = req.params;

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({ error: "This stock does not exist in database." });
            return;
        }

        const likes = await Like.findAll({
            where: { StockId: stock.id },
            include: [{ model: User }]
        });

        res.status(200).json({ likes });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/likes/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ where: { username } });

        if (user === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }

        const likes = await Like.findAll({
            where: { UserId: user.id },
            include: [{ model: Stock }]
        });

        if (likes.length === 0) {
            res.status(404).json({ error: "This user doesn't like any stocks." })
            return;
        }

        const stocksYouLike = likes.map((like) => like.Stock);

        res.status(200).json({ stocksYouLike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/like", async (req, res) => {
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

        const likeData = {
            UserId: user.id,
            StockId: stock.id
        };

        // Check if user is disliking stock and undislike if they are
        const dislike = await Dislike.findOne({ where: likeData });
        if (dislike !== null) {
            await dislike.destroy();
        }

        const like = await Like.findOne({ where: likeData });

        if (like !== null) {
            res.status(409).json({ error: "This user already likes this stock." });
            return;
        }

        const newLike = await Like.create(likeData);

        res.status(200).json({ like: newLike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/unlike", async (req, res) => {
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

        const likeData = {
            UserId: user.id,
            StockId: stock.id
        };

        const like = await Like.findOne({ where: likeData });

        if (like === null) {
            res.status(409).json({ error: "This user does not like this stock." });
            return;
        }

        await like.destroy();

        res.status(200).json({ like });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
