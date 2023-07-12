import "./Home.css";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { useState } from "react";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    
    return (
        <div className="home">
            <StockNews stocks={stocks} />
            <StocksYouFollow stocks={stocks} setStocks={setStocks} />
        </div>
    );
}
