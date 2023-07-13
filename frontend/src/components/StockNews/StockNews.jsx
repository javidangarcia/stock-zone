import "./StockNews.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { formatDate, firstWord } from "../../utils.js";
import { UserContext } from "../App/App";

export default function StockNews({ stocks }) {
    const [stockNews, setStockNews] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);
    const { setError } = useContext(UserContext);

    useEffect(() => {
        const fetchStockNews = async () => {
            if (currentStock != null) {
                try {
                    const searchTerm = firstWord(currentStock.name);
                    const newsUrl = new URL("https://newsapi.org/v2/everything");
                    newsUrl.searchParams.append("q", searchTerm);
                    newsUrl.searchParams.append("sortBy", "relevancy");
                    newsUrl.searchParams.append("pageSize", "5");
                    newsUrl.searchParams.append("apiKey", import.meta.env.VITE_NEWS);
                    const response = await axios.get(newsUrl, { validateStatus: () => true });

                    if (response.data.status === "ok") {
                        setStockNews(response.data.articles);
                    }

                    if (response.data.status === "error") {
                        setError(`${response.data.code}: ${response.data.message}`);
                    }
                } catch (error) {
                    setError(`System Error: ${error.message}`);
                }
            }
        };
        fetchStockNews();
    }, [currentStock]);

    const handleOptions = (event) => {
        const ticker = event.target.value;
        stocks.map((stock) => {
            if (stock.ticker === ticker) {
                setCurrentStock(stock);
                return;
            }
        })
    }

    return (
        <div className="stock-news">
            <h1>Related News</h1>
            <select className="stock-options" value={currentStock?.ticker || ""} onChange={handleOptions}>
                <option value="" disabled defaultValue>Select a Stock You Follow</option>
                {
                    stocks?.map((stock) => (
                        <option key={stock.ticker} value={stock.ticker}>{stock.ticker}</option>
                    ))
                }
            </select>
            <div className="news">
                {stockNews?.map((article) => (
                    <div className="article-margin" key={article.url}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link">
                            <div className="article">
                                <div className="article-logo">
                                    <img
                                        src={currentStock.logo}
                                        alt={`This is a logo of ${currentStock.name}.`}
                                    />
                                </div>
                                <div className="article-content">
                                    <h2>{article.title}</h2>
                                    <p>{article.content}</p>
                                    <p>{formatDate(article.publishedAt)} • {article.author}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
