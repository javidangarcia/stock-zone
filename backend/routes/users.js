import express from "express";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { PROFILE_PICTURE } from "../utils.js";

const router = express.Router();

router.get("/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({
            where: { username }
        });
    
        if (user === null) {
            res.status(404).json({ error: "This user doesn't exist." });
            return;
        }
    
        res.status(200).json({
            user: {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                picture: PROFILE_PICTURE
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/users/signup", async (req, res) => {
    const { fullName, username, password, email } = req.body;

    const user = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] }
    });

    if (user !== null) {
        res.status(409).json({ error: "Username or email already exists." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            picture: PROFILE_PICTURE
        });

        req.session.user = newUser;

        res.status(200).json({
            user: {
                fullName,
                username,
                email,
                picture: PROFILE_PICTURE
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/users/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            where: { username }
        });

        if (user === null) {
            res.status(401).json({ error: "Invalid username or password." });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid username or password." });
            return;
        }

        req.session.user = user;

        res.status(200).json({
            user: {
                fullName: user.fullName,
                username,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/users/logout", async (req, res) => {
    try {
        const session = req.session.destroy();
        res.status(200).json({ session });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
