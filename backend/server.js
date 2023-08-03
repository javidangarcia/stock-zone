import http from "http";
import express from "express";
import cors from "cors";
import session from "express-session";
import SequelizeStoreInit from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { sequelize } from "./database.js";
import stockRoutes from "./routes/stocks.js";
import userRoutes from "./routes/users.js";
import followRoutes from "./routes/follows.js";
import rankingRoutes from "./routes/rankings.js";
import likeRoutes from "./routes/likes.js";
import dislikeRoutes from "./routes/dislikes.js";
import commentRoutes from "./routes/comments.js";
import friendRoutes from "./routes/friends.js";
import messageRoutes from "./routes/messages.js";
import { checkSession } from "./utils.js";
import postRoutes from "./routes/posts.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);
app.use(express.json());

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
    db: sequelize
});

// Session middleware
app.use(
    session({
        secret: "stock-zone",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            sameSite: false,
            secure: false,
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year in milliseconds
        }
    })
);
sessionStore.sync();

app.use(userRoutes);

app.use(checkSession);

app.use(stockRoutes);
app.use(friendRoutes);
app.use(likeRoutes);
app.use(followRoutes);
app.use(dislikeRoutes);
app.use(rankingRoutes);
app.use(commentRoutes);
app.use(messageRoutes);
app.use(postRoutes);

// Chat App
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Chat server is running.");
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });
