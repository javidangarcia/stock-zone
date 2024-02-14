import express from "express";
import pgSession from "connect-pg-simple";
import { pool } from "./db/db.js";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import friendRoutes from "./routes/friends.js";
import userRoutes from "./routes/users.js";
import stockRoutes from "./routes/stocks.js";
import actionRoutes from "./routes/interactions.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js";
import rankingRoutes from "./routes/rankings.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.SERVER_PORT || 3000;

const pgStore = pgSession(session);
const sessionStore = new pgStore({
    pool,
    tableName: "sessions",
});

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.set("trust proxy", 1);

app.use(
    session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        name: "session",
        cookie: {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            expires: 365 * 24 * 60 * 60 * 1000,
        },
    })
);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is available for automated tasks." });
})

app.use(authRoutes);

const checkSession = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        res.status(401).json({ error: "Missing Session." });
        return;
    }
    next();
};

app.use(checkSession);
app.use(friendRoutes);
app.use(userRoutes);
app.use(stockRoutes);
app.use(actionRoutes);
app.use(postRoutes);
app.use(messageRoutes);
app.use(rankingRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

io.on("connection", socket => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", data => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", data => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
