import express from "express";
import { Dislike } from "../models/dislike.js";
import { Stock } from "../models/stock.js";
import { Like } from "../models/like.js";

const router = express.Router();

router.post("/dislike", async (req, res) => {
    const user = req.session.user;
    const ticker = req.body.ticker?.toUpperCase();

    if (ticker == null) {
        return res.status(400).json({ error: "Invalid request body." });
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            return res
                .status(404)
                .json({ error: "This stock does not exist in database." });
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
            return res
                .status(409)
                .json({ error: "This user already dislikes this stock." });
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
        return res.status(400).json({ error: "Invalid request body." });
    }

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            return res
                .status(404)
                .json({ error: "This stock does not exist in database." });
        }

        const dislikeData = {
            UserId: user.id,
            StockId: stock.id
        };

        const dislike = await Dislike.findOne({ where: dislikeData });

        if (dislike === null) {
            return res
                .status(409)
                .json({ error: "This user does not dislike this stock." });
        }

        await dislike.destroy();

        res.status(200).json({ dislike });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
