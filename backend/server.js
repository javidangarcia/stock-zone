import express from "express";
import cors from "cors";
import { sequelize } from "./database.js";
import stockRoutes from "./routes/stocks.js";
import userRoutes from "./routes/users.js";
import followRoutes from "./routes/follows.js";
import session from "express-session";
import SequelizeStoreInit from 'connect-session-sequelize';
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
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

app.use(stockRoutes);
app.use(userRoutes);
app.use(followRoutes);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });
