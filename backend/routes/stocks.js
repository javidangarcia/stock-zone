import express from "express";
import { Stock } from "../models/stock.js";
import { Follow } from "../models/follow.js";

const router = express.Router();

// Create a new stock in database
router.post("/stocks", async (req, res) => {
    try {
        const stock = await Stock.create(req.body);
        res.json({ stock });
    } catch (error) {
        res.send({ error });
    }
});

// Get a specific stock from database
router.get("/stocks/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const stock = await Stock.findOne({
        where: { ticker }
    });

    const user = req.session.user;

    const StockId = stock.id;
    const UserId = user.id;

    const following = await Follow.findOne({ where: { UserId, StockId } });

    following
        ? (stock.dataValues.following = true)
        : (stock.dataValues.following = false);

    res.json({ stock });
});

export default router;
