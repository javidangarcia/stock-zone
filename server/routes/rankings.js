import express from "express";
import { getRanking } from "../handlers/rankings.js";

const router = express.Router();

router.get("/ranking/:page", async (req, res) => {
    try {
        const { page } = req.params;
        const { user } = req.session;

        const stocksRanking = await getRanking(user, Number.parseInt(page, 10));

        res.status(200).json(stocksRanking);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
