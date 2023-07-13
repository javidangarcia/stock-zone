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
        res.json({ error });
    }
});

// Get a specific stock from database
router.get("/stocks/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();

    try {
        const stock = await Stock.findOne({
            where: { ticker }
        });

        if (stock === null) {
            return res
                .status(404)
                .json({ error: "This stock does not exist in database." });
        }

        const user = req.session.user;

        if (user != null) {
            const StockId = stock.id;
            const UserId = user.id;

            const following = await Follow.findOne({
                where: { UserId, StockId }
            });

            following
                ? (stock.dataValues.following = true)
                : (stock.dataValues.following = false);

            return res.status(200).json({ stock });
        }

        return res.status(200).json({ stock });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
