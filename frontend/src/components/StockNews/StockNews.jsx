import "./StockNews.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { formatDate, getMarketNewsUrl, getStockNewsUrl } from "../../utils.js";
import { UserContext } from "../App/App";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";

export default function StockNews({ stocks }) {
    const [stockNews, setStockNews] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);
    const { setErrorMessage, setLoading } = useContext(UserContext);
    const [articlesToShow, setArticlesToShow] = useState(5);

    useEffect(() => {
        const fetchStockNews = async () => {
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
                        (article) => article.image !== ""
                    );
                    setArticlesToShow(5);
                    setStockNews(filteredStockNews);
                } else {
                    setErrorMessage(`${response.error}`);
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
                setErrorMessage(`System Error: ${error.message}`);
            }
        };
        fetchStockNews();
    }, [currentStock]);

    return (
        <div className="stock-news">
            <h1>Related News</h1>
            <DropdownButton
                title={currentStock === null ? "Select a Stock" : currentStock}
                className="mt-2 mb-3"
            >
                {stocks?.map((stock) => {
                    return (
                        <Dropdown.Item
                            key={stock.ticker}
                            onClick={() => setCurrentStock(stock.ticker)}
                        >
                            {stock.ticker}
                        </Dropdown.Item>
                    );
                })}
            </DropdownButton>
            {stockNews?.slice(0, articlesToShow).map((article) => {
                return (
                    <Card
                        key={article.id}
                        className="mb-5 cursor-pointer"
                        onClick={() => window.open(article.url, "_blank")}
                        style={{ cursor: "pointer" }}
                    >
                        <Card.Img variant="top" src={article.image} />
                        <Card.Body>
                            <Card.Text>{article.headline}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">
                                {article.source} •{" "}
                                {formatDate(article.datetime)}
                            </small>
                        </Card.Footer>
                    </Card>
                );
            })}
            {stockNews?.length > articlesToShow ? (
                <Button
                    variant="outline-primary"
                    onClick={() => setArticlesToShow((prev) => prev + 3)}
                >
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
