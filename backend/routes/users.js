import express from "express";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const router = express.Router();

// Creating a new user in database
router.post("/users/signup", async (req, res) => {
    const { username, password, email } = req.body;

    const userAlreadyExists = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] }
    });

    if (userAlreadyExists) {
        res.status(409).json({ error: "Username or email already exists." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email
        });

        req.session.user = newUser;

        res.status(200).json({
            user: {
                username,
                email
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

        const email = user.email;

        res.status(200).json({
            user: {
                username,
                email
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
