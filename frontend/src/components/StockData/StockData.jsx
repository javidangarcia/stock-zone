import "./StockData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Follow from "../Follow/Follow";
import { capitalize } from "../../utils.js";

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
                    `http://localhost:3000/stocks/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (databaseResponse.status === 200) {
                    setStockData(databaseResponse.data.stock);
                    return;
                }

                const stockOverviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${
                    import.meta.env.VITE_ALPHA
                }`;
                const stockPriceUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${
                    import.meta.env.VITE_FINNHUB
                }`;
                const stockLogoUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${
                    import.meta.env.VITE_FINNHUB
                }`;

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

                const stockSector = capitalize(overviewData.Sector);

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
                    <p>Loading...</p>
                </div>
            ) : stockNotFound ? (
                <div className="stock-not-found">
                    <p>Stock Not Found...</p>
                </div>
            ) : (
                <>
                    <div className="stock-details">
                        <p className="stock-name">
                            {stockData.name} ({stockData.ticker})
                        </p>
                        <div className="stock-follow">
                            <p className="stock-price">${stockData.price}</p>
                            <Follow
                                ticker={ticker}
                                stockData={stockData}
                                setStockData={setStockData}
                            />
                        </div>
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
