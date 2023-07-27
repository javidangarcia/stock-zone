import express from "express";
import { RankingV3 } from "../ranking.js";

const router = express.Router();

router.get("/ranking", async (req, res) => {
    const user = req.session.user;

    try {
        const response = await RankingV3(user);

        if (response.status === 200) {
            res.status(response.status).json(response.data);
            return;
        }

        if (response.status === 422 || response.status === 500) {
            res.status(response.status).json({ error: response.error });
            return;
        }
    } catch (error) {
        res.status(500).json({ error });
    }

});

export default router;
