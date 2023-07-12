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
            if (currentStock) {
                try {
                    const searchTerm = firstWord(currentStock.name);
                    const url = `https://newsapi.org/v2/everything?q=${searchTerm}&sortBy=relevancy&pageSize=5&apiKey=${import.meta.env.VITE_NEWS}`;
                    const response = await axios.get(url);
                    setStockNews(response.data.articles);
                } catch (error) {
                    setError(`${error.message}: Please try again later.`);
                }
            }
        };
        fetchStockNews();
    }, [currentStock]);

    return (
        <div className="stock-news">
            <h1>Related News</h1>
            <select className="stock-options" value={currentStock?.ticker || ""} onChange={(event) => setCurrentStock(JSON.parse(event.target.value))}>
                <option value="" disabled defaultValue>Select a Stock You Follow</option>
                {
                    stocks?.map((stock) => (
                        <option key={stock.ticker} value={JSON.stringify(stock)}>{stock.ticker}</option>
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
                                        alt=""
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
