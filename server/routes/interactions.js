import express from "express";
import { pool } from "../db/db.js";

const router = express.Router();

router.post("/stocks/:ticker/follow", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockFollow = await pool.query(
            "SELECT * FROM follows WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockFollow.rows.length > 0) {
            res.status(409).json({
                error: "This user already follows this stock.",
            });
            return;
        }

        const newUserStockFollow = await pool.query(
            "INSERT INTO follows (userid, stockid) VALUES ($1, $2) RETURNING *",
            [userId, stockId]
        );

        res.status(200).json(newUserStockFollow.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.delete("/stocks/:ticker/unfollow", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockFollow = await pool.query(
            "SELECT * FROM follows WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockFollow.rows.length === 0) {
            res.status(409).json({
                error: "This user does not follow this stock.",
            });
            return;
        }

        await pool.query(
            "DELETE FROM follows WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        res.status(200).json({
            message: "The stock has been successfully unfollowed.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/stocks/:ticker/like", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockDislike = await pool.query(
            "SELECT * FROM dislikes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockDislike.rows.length > 0) {
            await pool.query(
                "DELETE FROM dislikes WHERE userid = $1 AND stockid = $2",
                [userId, stockId]
            );
        }

        const userStockLike = await pool.query(
            "SELECT * FROM likes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockLike.rows.length > 0) {
            res.status(409).json({
                error: "This user already likes this stock.",
            });
            return;
        }

        const newUserStockLike = await pool.query(
            "INSERT INTO likes (userid, stockid) VALUES ($1, $2) RETURNING *",
            [userId, stockId]
        );

        res.status(200).json(newUserStockLike.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.delete("/stocks/:ticker/unlike", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockLike = await pool.query(
            "SELECT * FROM likes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockLike.rows.length === 0) {
            res.status(409).json({
                error: "This user does not like this stock.",
            });
            return;
        }

        await pool.query(
            "DELETE FROM likes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        res.status(200).json({
            message: "The stock has been successfully unliked.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/stocks/:ticker/dislike", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockLike = await pool.query(
            "SELECT * FROM likes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockLike.rows.length > 0) {
            await pool.query(
                "DELETE FROM likes WHERE userid = $1 AND stockid = $2",
                [userId, stockId]
            );
        }

        const userStockDislike = await pool.query(
            "SELECT * FROM dislikes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockDislike.rows.length > 0) {
            res.status(409).json({
                error: "This user already dislikes this stock.",
            });
            return;
        }

        const newUserStockDislike = await pool.query(
            "INSERT INTO dislikes (userid, stockid) VALUES ($1, $2) RETURNING *",
            [userId, stockId]
        );

        res.status(200).json(newUserStockDislike.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.delete("/stocks/:ticker/undislike", async (req, res) => {
    try {
        const { user } = req.session;
        const ticker = req.params.ticker?.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(404).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        const userId = user.id;
        const stockId = stock.rows[0].id;

        const userStockDislike = await pool.query(
            "SELECT * FROM dislikes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        if (userStockDislike.rows.length === 0) {
            res.status(409).json({
                error: "This user does not dislike this stock.",
            });
            return;
        }

        await pool.query(
            "DELETE FROM dislikes WHERE userid = $1 AND stockid = $2",
            [userId, stockId]
        );

        res.status(200).json({
            message: "The stock has been successfully unliked.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
