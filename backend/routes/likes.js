import express from "express";
import { Like } from "../models/like.js";
import { Stock } from "../models/stock.js";
import { Dislike } from "../models/dislike.js";

const router = express.Router();

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
