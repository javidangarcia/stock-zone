import express from "express";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const router = express.Router();

// Creating a new user in database
router.post("/users", async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const userAlreadyExists = await User.findOne({
            where: { [Op.or]: [{ username }, { email }] }
        });

        if (userAlreadyExists) {
            return res.status(400).json({ error: "Username or email already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword, email });

        res.status(200).json({ user: newUser })
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

router.post("/users/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (user === null) {
        return res.status(401).send("Invalid username or password.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid username or password." });
    }

    res.status(200).json({ user });
});

export default router;
