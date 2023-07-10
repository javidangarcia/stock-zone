import "./StockData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StockData(props) {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [stockNotFound, setStockNotFound] = useState(false);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setIsLoading(true);
                setStockNotFound(false);

                const databaseResponse = await axios.get(
                    `http://localhost:3000/stocks/${ticker}`
                );
                const stockExistsInDatabase = databaseResponse.data
                    ? true
                    : false;

                if (stockExistsInDatabase) {
                    setStockData(databaseResponse.data);
                    return;
                }

                const stockOverviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${import.meta.env.VITE_ALPHA}`;
                const stockPriceUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${import.meta.env.VITE_FINNHUB}`;
                const stockLogoUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${import.meta.env.VITE_FINNHUB}`;

                const [overviewResponse, priceResponse, logoResponse] =
                    await Promise.all([
                        axios.get(stockOverviewUrl),
                        axios.get(stockPriceUrl),
                        axios.get(stockLogoUrl)
                    ]);

                const overviewData = overviewResponse.data;
                const priceData = priceResponse.data;
                const logoData = logoResponse.data;

                if (Object.keys(overviewData).length === 0) {
                    throw new Error("Stock data not found");
                }

                const stockSector = overviewData.Sector.charAt(0).toUpperCase() + overviewData.Sector.slice(1).toLowerCase()

                const combinedStockData = {
                    ticker: overviewData.Symbol,
                    name: overviewData.Name,
                    description: overviewData.Description,
                    sector: stockSector,
                    price: priceData.c,
                    logo: logoData.logo
                };

                setStockData(combinedStockData);

                // POST stock data to database for later use
                axios.post("http://localhost:3000/stocks", combinedStockData);

            } catch (error) {
                setStockNotFound(true);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        };
        fetchStockData();
    }, []);

    return (
        <div className="stock-data">
            {isLoading ? (
                <div className="loading">
                    <div className="ball"></div>
                    <p>Loading...</p>
                </div>
            ) : stockNotFound ? (
                <div className="stock-not-found">
                    <p>Stock Not Found...</p>
                </div>
            ) : (
                <>
                    <div className="stock-details">
                        <p className="stock-name">{stockData.name} ({stockData.ticker})</p>
                        <p className="stock-price">${stockData.price}</p>
                        <p>{stockData.description}</p>
                        <p>Sector: {stockData.sector}</p>
                    </div>
                    <div className="stock-logo">
                        <img
                            src={stockData.logo}
                            alt={`This is a logo of ${stockData.name}.`}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
