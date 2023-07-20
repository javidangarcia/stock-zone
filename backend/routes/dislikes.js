import express from "express";
import { Dislike } from "../models/dislike.js";
import { Stock } from "../models/stock.js";
import { Like } from "../models/like.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/dislikes/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ where: { username } });

        if (user === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }

        const dislikes = await Dislike.findAll({
            where: { UserId: user.id },
            include: [{ model: Stock }]
        });

        if (dislikes.length === 0) {
            res.status(404).json({ error: "This user doesn't dislike any stocks." });
            return;
        }

        const stocksYouDislike = dislikes.map((dislike) => dislike.Stock);

        res.status(200).json({ stocksYouDislike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/dislike", async (req, res) => {
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

        const dislikeData = {
            UserId: user.id,
            StockId: stock.id
        };

        // Check if user is liking stock and unlike if they are
        const like = await Like.findOne({ where: dislikeData });
        if (like !== null) {
            await like.destroy();
        }

        const dislike = await Dislike.findOne({ where: dislikeData });

        if (dislike !== null) {
            res.status(409).json({ error: "This user already dislikes this stock." });
            return;
        }

        const newDislike = await Dislike.create(dislikeData);

        res.status(200).json({ dislike: newDislike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/undislike", async (req, res) => {
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

        const dislikeData = {
            UserId: user.id,
            StockId: stock.id
        };

        const dislike = await Dislike.findOne({ where: dislikeData });

        if (dislike === null) {
            res.status(409).json({ error: "This user does not dislike this stock." });
            return;
        }

        await dislike.destroy();

        res.status(200).json({ dislike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
