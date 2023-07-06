import "./StockData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { ALPHA_API_KEY, FINNHUB_API_KEY } from "../../constants";
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

                const databaseResponse = await axios.get(`http://localhost:3000/stocks/${ticker}`);
                const stockExistsInDatabase = databaseResponse.data ? true : false;

                if (stockExistsInDatabase) {
                    setStockData(databaseResponse.data);
                    setStockNotFound(false);
                    return;
                }

                const stockOverviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_API_KEY}`;
                const stockPriceUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
                const stockLogoUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=ciefl6pr01qmfas4d2hgciefl6pr01qmfas4d2i0`;
                
                const [overviewResponse, priceResponse, logoResponse] = await Promise.all([
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

                const combinedStockData = {
                    ticker: overviewData.Symbol,
                    name: overviewData.Name,
                    description: overviewData.Description,
                    sector: overviewData.Sector,
                    price: priceData.c,
                    logo: logoData.logo
                };

                setStockData(combinedStockData);

                // POST stock data to database for later use
                axios.post("http://localhost:3000/stocks", combinedStockData);
                
                setStockNotFound(false);
            } catch (error) {
                setStockNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStockData();
    }, []);

    return (
        <div className="stock-data">
            {isLoading ? (
                <p>Loading...</p>
            ) : stockNotFound ? (
                <p>Stock Not Found...</p>
            ) : (
                <>
                    <div>
                        <p>Ticker: {stockData.ticker}</p>
                        <p>Name: {stockData.name}</p>
                        <p>Description: {stockData.description}</p>
                        <p>Sector: {stockData.sector}</p>
                        <p>Price: ${stockData.price}</p>
                    </div>
                    <img src={stockData.logo} alt={`This is a logo of ${stockData.name}.`} />
                </>
            )}
        </div>
    );
}
