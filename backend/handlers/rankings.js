import { RankingAlgorithmV5 } from "./algorithms.js";
import { pool } from "../database/db.js";

export const getRanking = async (user, pageNumber, pageSize = 5) => {
    try {
        const userId = user.id;

        if (pageNumber === 1) {
            const stocksRanking = await RankingAlgorithmV5(userId);

            await pool.query(
                `INSERT INTO rankings (ranking, userid) VALUES ($1, $2)
                ON CONFLICT (userid) DO UPDATE SET ranking = $1`,
                [stocksRanking, userId]
            );

            return stocksRanking.slice(0, pageSize);
        }

        const stocksRanking = await pool.query(
            "SELECT * FROM rankings WHERE userid = $1",
            [userId]
        );

        return stocksRanking.rows[0].ranking.slice(
            (pageNumber - 1) * pageSize,
            pageNumber * pageSize
        );
    } catch (error) {
        console.error(error);
        throw new Error("Error calculating stocks ranking.");
    }
};
