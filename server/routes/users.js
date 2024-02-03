import express from "express";
import { pool } from "../db/db.js";

const router = express.Router();

router.get("/users/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        res.status(200).json({
            id: existingUser.rows[0].id,
            name: existingUser.rows[0].name,
            username,
            email: existingUser.rows[0].email,
            picture: existingUser.rows[0].picture,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/users/:username/following", async (req, res) => {
    try {
        const { username } = req.params;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        const userId = existingUser.rows[0].id;

        const stocks = await pool.query(
            `SELECT stocks.* FROM stocks 
             INNER JOIN follows 
             ON stocks.id = follows.stockid 
             WHERE follows.userid = $1`,
            [userId]
        );

        res.status(200).json(stocks.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/users/:username/liked", async (req, res) => {
    try {
        const { username } = req.params;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        const userId = existingUser.rows[0].id;

        const stocks = await pool.query(
            `SELECT stocks.* FROM stocks 
             INNER JOIN likes 
             ON stocks.id = likes.stockid 
             WHERE likes.userid = $1`,
            [userId]
        );

        res.status(200).json(stocks.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/users/:username/disliked", async (req, res) => {
    try {
        const { username } = req.params;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        const userId = existingUser.rows[0].id;

        const stocks = await pool.query(
            `SELECT stocks.* FROM stocks 
             INNER JOIN dislikes 
             ON stocks.id = dislikes.stockid 
             WHERE dislikes.userid = $1`,
            [userId]
        );

        res.status(200).json(stocks.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
