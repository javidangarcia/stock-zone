import express from "express";
import { GetRanking } from "../ranking.js";

const router = express.Router();

router.get("/ranking/:page", async (req, res) => {
    const { user } = req.session;
    const { page } = req.params;

    try {
        const response = await GetRanking(user, parseInt(page, 10));

        if (response.status === 200) {
            res.status(response.status).json(response.data);
            return;
        }

        if (response.status === 422 || response.status === 500) {
            res.status(response.status).json({ error: response.error });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
