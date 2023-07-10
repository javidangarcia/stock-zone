import express from "express";
import { Stock } from "../models/stock.js";

const router = express.Router();

// Create a new stock in database
router.post("/stocks", async (req, res) => {
    try {
        const stock = await Stock.create(req.body);
        res.json(stock);
    } catch (error) {
        res.send(error);
    }
});

// Get a specific stock from database
router.get("/stocks/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    try {
        const stock = await Stock.findOne({
            where: { ticker }
        });
        res.json(stock);
    } catch (error) {
        res.send(error);
    }
});

export default router;