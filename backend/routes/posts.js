import express from "express";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";

const router = express.Router();

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
    const user = req.session.user;
    const { title, content } = req.body;

    try {
        const postData = {
            title,
            content,
            UserId: user.id
        };
        const newPost = await Post.create(postData);
        res.status(200).json({ post: newPost });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
