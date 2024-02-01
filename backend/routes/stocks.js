import express from "express";
import { pool } from "../database.js";

const router = express.Router();

router.get("/stocks", async (req, res) => {
    try {
        const stocks = await pool.query("SELECT * FROM stocks");

        if (stocks.rows.length === 0) {
            res.status(404).json({
                error: "There are no stocks in the database.",
            });
            return;
        }

        res.status(200).json(stocks.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/stocks", async (req, res) => {
    try {
        const { ticker, name, description, sector, price, logo } = req.body;

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length > 0) {
            res.status(409).json({
                error: "This stock already exists in the database.",
            });
            return;
        }

        const newStock = await pool.query(
            "INSERT INTO stocks (ticker, name, description, sector, price, logo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [ticker, name, description, sector, price, logo]
        );

        res.status(200).json(newStock.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/stocks/:ticker", async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();

        const stock = await pool.query(
            "SELECT * FROM stocks WHERE ticker = $1",
            [ticker]
        );

        if (stock.rows.length === 0) {
            res.status(409).json({
                error: "This stock does not exist in the database.",
            });
            return;
        }

        res.status(200).json(stock.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/stocks/:ticker/followers", async (req, res) => {
    try {
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

        const stockId = stock.rows[0].id;

        const users = await pool.query(
            `SELECT users.* FROM users 
             INNER JOIN follows 
             ON users.id = follows.userid 
             WHERE follows.stockid = $1`,
            [stockId]
        );

        res.status(200).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/stocks/:ticker/likers", async (req, res) => {
    try {
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

        const stockId = stock.rows[0].id;

        const users = await pool.query(
            `SELECT users.* FROM users 
             INNER JOIN likes 
             ON users.id = likes.userid 
             WHERE likes.stockid = $1`,
            [stockId]
        );

        res.status(200).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/stocks/:ticker/dislikers", async (req, res) => {
    try {
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

        const stockId = stock.rows[0].id;

        const users = await pool.query(
            `SELECT users.* FROM users 
             INNER JOIN dislikes 
             ON users.id = dislikes.userid 
             WHERE dislikes.stockid = $1`,
            [stockId]
        );

        res.status(200).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
