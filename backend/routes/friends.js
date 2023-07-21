import express from "express";
import { Friend } from "../models/friend.js";
import { User } from "../models/user.js";

const router = express.Router();

router.post("/friend", async (req, res) => {
    const user = req.session.user;
    const { username } = req.body;

    try {

        const user2 = await User.findOne({ where: { username } });

        if (user2 === null) {
            res.status(404).json({ error: "This user doesn't exist." })
            return;
        }

        const friendData = {
            UserId1: user.id,
            UserId2: user2.id
        }

        const friend = await Friend.findOne({ where: friendData });

        if (friend !== null) {
            res.status(409).json({ error: "You are already friends with this user." });
            return;
        }

        const newFriend = await Friend.create(friendData);

        res.status(200).json({ newFriend });
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.post("/unfriend", async (req, res) => {
    const user = req.session.user;
    const { username } = req.body;

    try {
        const user2 = await User.findOne({ where: { username } });

        if (user2 === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }

        const friendData = {
            UserId1: user.id,
            UserId2: user2.id
        }

        const friend = await Friend.findOne({ where: friendData });

        if (friend === null) {
            res.status(409).json({ error: "You are not friends with this user." });
            return;
        }

        await friend.destroy();

        res.status(200).json({ friend });
    } catch (error) {
        res.status(500).json({ error });
    }
})

export default router;
