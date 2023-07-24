import "./Home.css";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { useState } from "react";

export default function Home() {
    const [stocks, setStocks] = useState([]);

    return (
        <div className="home">
            <div className="home-container">
                <StockNews stocks={stocks} />
            </div>
            <div className="home-container">
                <StocksYouFollow stocks={stocks} setStocks={setStocks} />
            </div>
        </div>
    );
}
