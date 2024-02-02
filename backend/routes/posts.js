import express from "express";
import { pool } from "../database/db.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
    try {
        const posts = await pool.query("SELECT * FROM posts");
        res.status(200).json(posts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/posts", async (req, res) => {
    try {
        const { user } = req.session;
        const { title, content } = req.body;

        const userId = user.id;

        const newPost = await pool.query(
            "INSERT INTO posts (title, content, userid) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userId]
        );

        res.status(200).json(newPost.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
            postId,
        ]);

        if (post.rows.length === 0) {
            res.status(404).json({ error: "This post does not exist." });
            return;
        }

        res.status(200).json(post.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.get("/posts/:postId/replies", async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
            postId,
        ]);

        if (post.rows.length === 0) {
            res.status(404).json({ error: "This post does not exist." });
            return;
        }

        const replies = await pool.query(
            `SELECT replies.id, replies.content, users.id AS userid, users.name, 
                    users.username, users.email, users.picture FROM replies
            INNER JOIN users
            ON users.id = replies.userid
            WHERE replies.postid = $1`,
            [postId]
        );

        res.status(200).json(replies.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/posts/:postId/replies", async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const { user } = req.session;

        const userId = user.id;

        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
            postId,
        ]);

        if (post.rows.length === 0) {
            res.status(404).json({ error: "This post does not exist." });
            return;
        }

        const newReply = await pool.query(
            "INSERT INTO replies (content, userid, postid) VALUES ($1, $2, $3) RETURNING *",
            [content, userId, postId]
        );

        res.status(200).json(newReply.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
