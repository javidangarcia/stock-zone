import "./StockNews.css";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { formatDate, isValidArticle } from "../../utils";
import { setLoading } from "../../redux/loading";
import { fetchStockNews } from "../../api/news";
import { toast } from "react-toastify";

const ARTICLES_TO_SHOW = 5;
const ARTICLES_SUMMARY_LIMIT = 1000;

export default function StockNews({ stocks }) {
    const [stockNews, setStockNews] = useState([]);
    const [currentStock, setCurrentStock] = useState(stocks[0]);
    const [articlesToShow, setArticlesToShow] = useState(ARTICLES_TO_SHOW);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchStockNews(currentStock)
            .then(data => {
                const filteredStockNews = data.filter(
                    article =>
                        (article.category === "forex" &&
                            article.summary.length < ARTICLES_SUMMARY_LIMIT) ||
                        isValidArticle(currentStock, article)
                );
                setStockNews(filteredStockNews);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [currentStock]);

    return (
        <div className="stock-news">
            <h1 className={stocks.length === 0 ? "fs-3 m-0 mb-3" : "fs-3 m-0"}>
                Stock Market News
            </h1>
            <DropdownButton title={currentStock.ticker} className="mt-2 mb-3">
                {stocks.map(stock => (
                    <Dropdown.Item
                        key={stock.ticker}
                        onClick={() => setCurrentStock(stock)}
                    >
                        {stock.ticker}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            {stockNews?.slice(0, articlesToShow).map(article => (
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
                        setArticlesToShow(prev => prev + ARTICLES_TO_SHOW)
                    }
                >
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
