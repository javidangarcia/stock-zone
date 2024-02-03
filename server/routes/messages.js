import express from "express";
import { pool } from "../db/db.js";

const router = express.Router();

router.get("/messages/:friendId", async (req, res) => {
    try {
        const { friendId } = req.params;
        const { user } = req.session;

        const userId = user.id;

        const messages = await pool.query(
            `SELECT * FROM messages 
            WHERE (senderid = $1 AND receiverid = $2) 
            OR (senderid = $2 AND receiverid = $1)`,
            [userId, friendId]
        );

        res.status(200).json(messages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/messages/:friendId", async (req, res) => {
    try {
        const { user } = req.session;
        const { friendId } = req.params;
        const { room, content } = req.body;

        if (!room || !content) {
            res.status(400).json({
                error: "Please provide room and content in request body.",
            });
            return;
        }

        const userId = user.id;

        const message = await pool.query(
            "INSERT INTO messages (room, content, senderid, receiverid) VALUES ($1, $2, $3, $4) RETURNING *",
            [room, content, userId, friendId]
        );

        res.status(200).json(message.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
