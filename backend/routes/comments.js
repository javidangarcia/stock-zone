import express from "express";
import { Comment } from "../models/comment.js";
import { Stock } from "../models/stock.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/comments/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in the database."
            });
            return;
        }

        const comments = await Comment.findAll({
            where: { StockId: stock.id },
            include: [{ model: User }]
        });

        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/comments", async (req, res) => {
    const { user } = req.session;
    const { ticker, content } = req.body;

    try {
        const stock = await Stock.findOne({ where: { ticker } });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in the database."
            });
            return;
        }

        const commentData = {
            content,
            UserId: user.id,
            StockId: stock.id
        };

        const newComment = await Comment.create(commentData);

        const comment = await Comment.findOne({
            where: { id: newComment.id },
            include: [{ model: User }]
        });

        res.status(200).json({ comment });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
