import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import stockRoutes from "./routes/stocks.js";
import userRoutes from "./routes/users.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan());

app.use(stockRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });
