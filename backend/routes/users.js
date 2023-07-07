import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

// Creating a new user in database
router.post("/users", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(400).json({ error: "Username or email already exists." });
    }
})

router.post("/users/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    
    if (user === null) {
        return res.status(401).send("Invalid username or password.")
    }

    if (password != user.password) {
        return res.status(401).json({ error: "Invalid username or password." })
    }

    res.status(200).json({ user });

})

export default router;