import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

// Creating a new user in database
router.post("/users", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).send(error);
    }
})

export default router;