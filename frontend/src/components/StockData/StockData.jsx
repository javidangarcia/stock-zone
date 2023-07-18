import "./StockData.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Follow from "../Follow/Follow";
import Like from "../Like/Like";
import Dislike from "../Dislike/Dislike";
import Comments from "../Comments/Comments";
import {
    getStockOverviewUrl,
    getStockPriceUrl,
    getStockLogoUrl,
    capitalize
} from "../../utils.js";
import { UserContext } from "../App/App";

export default function StockData() {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [stockNotFound, setStockNotFound] = useState(false);
    const { setError } = useContext(UserContext);

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
                    setIsLoading(false);
                    return;
                }

                if (databaseResponse.status === 500) {
                    setError(`${response.statusText}: Please try again later.`);
                }

                const stockOverviewUrl = getStockOverviewUrl(ticker);
                const stockPriceUrl = getStockPriceUrl(ticker);
                const stockLogoUrl = getStockLogoUrl(ticker);

                const [overviewResponse, priceResponse, logoResponse] =
                    await Promise.all([
                        axios.get(stockOverviewUrl),
                        axios.get(stockPriceUrl),
                        axios.get(stockLogoUrl)
                    ]);

                const overviewData = overviewResponse.data;
                const priceData = priceResponse.data;
                const logoData = logoResponse.data;
                setIsLoading(false);

                if (Object.keys(overviewData).length === 0) {
                    setStockNotFound(true);
                    return;
                }

                if (overviewData.Note != null) {
                    setError(overviewData.Note);
                    return;
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
                const response = axios.post(
                    "http://localhost:3000/stocks", 
                    combinedStockData, 
                    { validateStatus: () => true }
                );

                if (response.status === 404) {
                    setError(response.data.error);
                }

                if (response.status === 500) {
                    setError(`${response.statusText}: Please try again later.`);
                }

            } catch (error) {
                setError(`${error.message}: Please try again later.`);
                setIsLoading(false);
                setStockNotFound(true);
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
            ) : null}

            {!isLoading && stockNotFound ? (
                <div className="stock-not-found">
                    <p>Stock Not Found...</p>
                </div>
            ) : null}

            {!isLoading && !stockNotFound ? (
                <>
                    <div className="stock-details">
                        <p className="stock-name">
                            {stockData.name} ({stockData.ticker})
                        </p>
                        <div className="stock-follow">
                            <p className="stock-price">${stockData.price?.toFixed(2)}</p>
                            <Follow
                                ticker={ticker}
                                stockData={stockData}
                                setStockData={setStockData}
                            />
                            <Like
                                ticker={ticker}
                                stockData={stockData}
                                setStockData={setStockData}
                            />
                            <Dislike
                                ticker={ticker}
                                stockData={stockData}
                                setStockData={setStockData}
                            />
                        </div>
                        <p>{stockData.description}</p>
                        <p>Sector: {stockData.sector}</p>
                        <Comments ticker={ticker} />
                    </div>
                    <div className="stock-logo">
                        <img
                            src={stockData.logo}
                            alt={`This is a logo of ${stockData.name}.`}
                        />
                    </div>
                </>
            ) : null}
        </div>
    );
}
