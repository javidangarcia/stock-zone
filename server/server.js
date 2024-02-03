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

const pgStore = pgSession(session);
const sessionStore = new pgStore({
    pool,
    tableName: "sessions",
});

app.use(
    cors({
        origin: process.env.CLIENT,
        credentials: true,
    })
);
app.use(express.json());
app.use(
    session({
        store: sessionStore,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        name: "authCookie",
        cookie: {
            sameSite: process.env.DEVELOPMENT === "prod" ? "None" : "Lax",
            secure: process.env.DEVELOPMENT === "prod",
            expires: 2 * 60 * 60 * 1000,
        },
    })
);

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
        origin: process.env.CLIENT,
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

const chatPort = process.env.CHAT_PORT || 3001;
const appPort = process.env.APP_PORT || 3000;

server.listen(chatPort, () => {
    console.log(`Chat server is running on port ${chatPort}.`);
});

app.listen(appPort, () => {
    console.log(`Express app is listening on port ${appPort}.`);
});
