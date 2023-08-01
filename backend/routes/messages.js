import express from "express";
import { Op } from "sequelize";
import { Message } from "../models/message.js";

const router = express.Router();

router.get("/messages/:friendID", async (req, res) => {
    const { user } = req.session;
    const { friendID } = req.params;

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [{ UserId1: user.id }, { UserId2: friendID }]
                    },
                    {
                        [Op.and]: [{ UserId1: friendID }, { UserId2: user.id }]
                    }
                ]
            }
        });
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/message", async (req, res) => {
    const { user } = req.session;
    const { room, author, friendID, content } = req.body;

    try {
        const messageData = {
            room,
            author,
            content,
            UserId1: user.id,
            UserId2: friendID
        };

        const message = await Message.create(messageData);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
