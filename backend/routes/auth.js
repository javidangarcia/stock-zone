import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../database/db.js";

const PICTURE =
    "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg";

const router = express.Router();

router.post("/users/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            res.status(400).json({
                error: "Please provide name, username, email, and password in request body.",
            });
            return;
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({
                error: "Username or email already exists.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, username, email, password, picture) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, username, email, hashedPassword, PICTURE]
        );

        req.session.user = newUser.rows[0];

        res.status(200).json({
            id: newUser.rows[0].id,
            name,
            username,
            email,
            picture: PROFILE_PICTURE,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                error: "Please provide username and password in request body.",
            });
            return;
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            res.status(401).json({ error: "Invalid username or password." });
            return;
        }

        const isValidPassword = await bcrypt.compare(
            password,
            existingUser.rows[0].password
        );

        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid username or password." });
            return;
        }

        req.session.user = existingUser.rows[0];

        res.status(200).json({
            id: existingUser.rows[0].id,
            name: existingUser.rows[0].name,
            username,
            email: existingUser.rows[0].email,
            picture: existingUser.rows[0].picture,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

router.post("/users/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("authCookie");
        res.status(200).json({
            message: "The user has been successfully logged out.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
