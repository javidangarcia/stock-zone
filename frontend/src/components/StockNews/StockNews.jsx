import "./StockNews.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
    formatDate,
    getMarketNewsUrl,
    getStockNewsUrl,
    isValidArticle,
    NetworkError
} from "../../utils";
import { setLoading } from "../../redux/loading";

const ARTICLES_TO_SHOW = 5;
const ARTICLES_SUMMARY_LIMIT = 1000;

export default function StockNews({ stocks }) {
    const [stockNews, setStockNews] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);
    const [articlesToShow, setArticlesToShow] = useState(ARTICLES_TO_SHOW);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStockNews = async () => {
            dispatch(setLoading(true));
            try {
                const newsUrl =
                    currentStock === null
                        ? getMarketNewsUrl()
                        : getStockNewsUrl(currentStock);

                const response = await axios.get(newsUrl, {
                    validateStatus: () => true
                });

                if (response.status === 200) {
                    const filteredStockNews = response.data.filter(
                        (article) =>
                            (article.category === "forex" &&
                                article.summary.length <
                                    ARTICLES_SUMMARY_LIMIT) ||
                            isValidArticle(currentStock, article)
                    );
                    setStockNews(filteredStockNews);
                }

                if (response.status === 429) {
                    Swal.fire({
                        icon: "error",
                        title: "API Limit Reached",
                        text: "Please try again later."
                    });
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError();
            }
        };
        fetchStockNews();
    }, [currentStock]);

    return (
        <div className="stock-news">
            <h1>Related News</h1>
            <DropdownButton
                title={
                    currentStock?.ticker == null
                        ? "Select a Stock"
                        : currentStock.ticker
                }
                className="mt-2 mb-3"
            >
                {stocks?.map((stock) => (
                    <Dropdown.Item
                        key={stock.ticker}
                        onClick={() => setCurrentStock(stock)}
                    >
                        {stock.ticker}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            {stockNews?.slice(0, articlesToShow).map((article) => (
                <Card
                    key={article.id}
                    className={
                        stocks.length > 0
                            ? "mb-5 cursor-pointer news-with-stocks"
                            : "mb-5 cursor-pointer news-only"
                    }
                    onClick={() => window.open(article.url, "_blank")}
                    style={{ cursor: "pointer" }}
                >
                    <Card.Img variant="top" src={article.image} />
                    <Card.Body>
                        <Card.Title>{article.headline}</Card.Title>
                        <Card.Text>{article.summary}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">
                            {article.source} • {formatDate(article.datetime)}
                        </small>
                    </Card.Footer>
                </Card>
            ))}
            {stockNews?.length > articlesToShow ? (
                <Button
                    className="mb-5"
                    variant="outline-primary"
                    onClick={() =>
                        setArticlesToShow((prev) => prev + ARTICLES_TO_SHOW)
                    }
                >
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
