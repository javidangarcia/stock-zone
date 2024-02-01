import http from "http";
import express from "express";
import cors from "cors";
import session from "express-session";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
// import stockRoutes from "./routes/stocks.js";
import userRoutes from "./routes/users.js";
import { checkSession } from "./utils.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);
app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.DEVELOPMENT === "prod" ? "none" : false,
            secure: process.env.DEVELOPMENT === "prod",
            expires: 500 * 1000
        }
    })
);

app.use(authRoutes);

app.use(checkSession);

app.use(userRoutes);
// app.use(stockRoutes);
// app.use(followRoutes);
// app.use(friendRoutes);
// app.use(likeRoutes);
// app.use(dislikeRoutes);
// app.use(rankingRoutes);
// app.use(commentRoutes);
// app.use(messageRoutes);
// app.use(postRoutes);

// // Chat App
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.FRONTEND_URL
//     }
// });

// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("join_room", (data) => {
//         socket.join(data);
//         console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     });

//     socket.on("send_message", (data) => {
//         socket.to(data.room).emit("receive_message", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("User Disconnected", socket.id);
//     });
// });

// server.listen(3001, "0.0.0.0", () => {
//     console.log("Chat server is running.");
// });

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
