import express from "express";
import { pool } from "../db/db.js";

const router = express.Router();

router.get("/users/friends", async (req, res) => {
    try {
        const { user } = req.session;

        const userId = user.id;

        const friends = await pool.query(
            `SELECT users.id, users.name, users.username, 
                    users.email, users.picture FROM users
            INNER JOIN friends
            ON receiverid = users.id
            WHERE senderid = $1`,
            [userId]
        );

        res.status(200).json(friends.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/users/:username/friend", async (req, res) => {
    try {
        const { username } = req.params;
        const { user: currentUser } = req.session;

        const friendToAdd = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (friendToAdd.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        const currentUserId = currentUser.id;
        const friendToAddId = friendToAdd.rows[0].id;

        const existingFriendship = await pool.query(
            "SELECT * FROM friends WHERE senderid = $1 AND receiverid = $2",
            [currentUserId, friendToAddId]
        );

        if (existingFriendship.rows.length > 0) {
            res.status(409).json({
                error: "The current user already added this user as a friend.",
            });
            return;
        }

        const newFriendship = await pool.query(
            "INSERT INTO friends (senderid, receiverid) VALUES ($1, $2) RETURNING *",
            [currentUserId, friendToAddId]
        );

        res.status(200).json(newFriendship.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.delete("/users/:username/unfriend", async (req, res) => {
    try {
        const { username } = req.params;
        const { user: currentUser } = req.session;

        const friendToRemove = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (friendToRemove.rows.length === 0) {
            res.status(404).json({ error: "This user does not exist." });
            return;
        }

        const currentUserId = currentUser.id;
        const friendToRemoveId = friendToRemove.rows[0].id;

        const existingFriendship = await pool.query(
            "SELECT * FROM friends WHERE senderid = $1 AND receiverid = $2",
            [currentUserId, friendToRemoveId]
        );

        if (existingFriendship.rows.length === 0) {
            res.status(409).json({
                error: "The current user has not added this user as a friend.",
            });
            return;
        }

        await pool.query(
            "DELETE FROM friends WHERE senderid = $1 AND receiverid = $2",
            [currentUserId, friendToRemoveId]
        );

        res.status(200).json({
            message: "This user has been successfully unfriended.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
