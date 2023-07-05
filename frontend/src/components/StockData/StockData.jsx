import "./StockData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { ALPHA_API_KEY, FINNHUB_API_KEY } from "../../constants";

export default function StockData({ currentStock }) {
    const [stockData, setStockData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [stockNotFound, setStockNotFound] = useState(false);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setIsLoading(true);

                const databaseResponse = await axios.get(`http://localhost:3000/stocks/${currentStock}`);
                const stockExistsInDatabase = databaseResponse.data ? true : false;

                if (stockExistsInDatabase) {
                    setStockData(databaseResponse.data);
                } else {
                    const stockOverviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${currentStock}&apikey=${ALPHA_API_KEY}`;
                    const stockPriceUrl = `https://finnhub.io/api/v1/quote?symbol=${currentStock}&token=${FINNHUB_API_KEY}`;
                    const overviewResponse = await axios.get(stockOverviewUrl);
                    const priceResponse = await axios.get(stockPriceUrl);
                    const overviewData = overviewResponse.data;
                    const priceData = priceResponse.data;

                    if (Object.keys(overviewData).length === 0) {
                        throw new Error("Stock data not found");
                    }

                    const combinedStockData = {
                        ticker: overviewData.Symbol,
                        name: overviewData.Name,
                        description: overviewData.Description,
                        sector: overviewData.Sector,
                        price: priceData.c,
                    };

                    setStockData(combinedStockData);

                    // POST stock data to database for later use
                    await axios.post("http://localhost:3000/stocks", combinedStockData);
                }

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
            {isLoading ? (
                <p>Loading...</p>
            ) : stockNotFound ? (
                <p>Stock Not Found...</p>
            ) : (
                <>
                    <p>Ticker: {stockData.ticker}</p>
                    <p>Name: {stockData.name}</p>
                    <p>Description: {stockData.description}</p>
                    <p>Sector: {stockData.sector}</p>
                    <p>Price: {stockData.price}</p>
                </>
            )}
        </div>
    );
}
