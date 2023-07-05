import "./StockData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { ALPHA_API_KEY, FINNHUB_API_KEY } from "../../constants";

export default function StockData({ currentStock }) {
    const [stockData, setStockData] = useState({});
    const [stockPrice, setStockPrice] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [stockNotFound, setStockNotFound] = useState(false);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setIsLoading(true);

                const stockOverviewURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${currentStock}&apikey=${ALPHA_API_KEY}`;
                const stockPriceURL = `https://finnhub.io/api/v1/quote?symbol=${currentStock}&token=${FINNHUB_API_KEY}`;
                const responseOverview = await axios.get(stockOverviewURL);
                const responsePrice = await axios.get(stockPriceURL);
                const overviewData = responseOverview.data;
                const priceData = responsePrice.data;

                if (Object.keys(overviewData).length === 0) {
                    throw new Error("Stock data not found");
                }

                setStockData(overviewData);
                setStockPrice(priceData);

                setStockNotFound(false);
            } catch (error) {
                setStockNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStockData();
    }, [currentStock]);

    return (
        <div className="stock-data">
            {
                isLoading ? (
                    <p>Loading...</p>
                ) : stockNotFound ? (
                    <p>Stock Not Found...</p>
                ) : (
                    <>
                        <p>Ticker: {stockData.Symbol}</p>
                        <p>Name: {stockData.Name}</p>
                        <p>Description: {stockData.Description}</p>
                        <p>Sector: {stockData.Sector}</p>
                        <p>Price: {stockPrice.c}</p>
                    </>
                )
            }
        </div>
    );
}
