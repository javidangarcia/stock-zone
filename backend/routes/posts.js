import express from "express";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { PostComment } from "../models/postComment.js";

const router = express.Router();

router.get("/post/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({
            where: { id },
            include: [{ model: User }]
        });

        if (post === null) {
            res.status(404).json({ error: "This Post Does Not Exist." });
            return;
        }

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/post/comments/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({ where: { id } });

        if (post === null) {
            res.status(404).json({ error: "This Post Does Not Exist." });
            return;
        }

        const comments = await PostComment.findAll({
            where: { PostId: post.id },
            include: [{ model: User }]
        });

        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/post/comment/:id", async (req, res) => {
    const { user } = req.session;
    const { id } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findOne({
            where: { id },
            include: [{ model: User }]
        });

        if (post === null) {
            res.status(404).json({ error: "This Post Does Not Exist." });
            return;
        }

        const commentData = {
            content,
            UserId: user.id,
            PostId: post.id
        };

        const newComment = await PostComment.create(commentData);

        const comment = await PostComment.findOne({
            where: { id: newComment.id },
            include: [{ model: User }]
        });

        res.status(200).json({ comment });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/posts/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ where: { username } });

        if (user === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }

        const posts = await Post.findAll({
            where: { UserId: user.id }
        });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.findAll({ include: [{ model: User }] });
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/post", async (req, res) => {
    const { user } = req.session;
    const { title, content } = req.body;

    try {
        const postData = {
            title,
            content,
            UserId: user.id
        };
        const newPost = await Post.create(postData);

        const post = await Post.findOne({
            where: { id: newPost.id },
            include: [{ model: User }]
        });

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
