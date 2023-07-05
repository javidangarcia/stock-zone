import express from "express";
import { sequelize } from "./database.js";
import { Stock } from "./models/stock.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan());

app.get("/stocks/:ticker", async (req, res) => {
    try {
        const stock = await Stock.findOne({
            where: { ticker: req.params.ticker },
        });
        res.json(stock);
    } catch (error) {
        res.send(error);
    }
});

app.post("/stocks", async (req, res) => {
    try {
        const stock = await Stock.create(req.body);
        res.json(stock);
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

sequelize.sync({ alter: true });
