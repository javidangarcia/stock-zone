import "./Ranking.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App/App";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const STOCKS_TO_SHOW = 10;

export default function Ranking() {
    const [stocksRanking, setStocksRanking] = useState([]);
    const { setErrorMessage, setLoading } = useContext(UserContext);
    const [stocksToShow, setStocksToShow] = useState(STOCKS_TO_SHOW);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/ranking`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStocksRanking(response.data.stocksRanking);
                }

                if (response.status === 422 || response.status === 401) {
                    setErrorMessage(response.data.error);
                }

                if (response.status === 500) {
                    setErrorMessage(
                        `${response.statusText}: Please try again later.`
                    );
                }

                setLoading(false);
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchRanking();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <h1 className="mt-4">Popular Stocks</h1>
            <p className="mb-4">
                Recommended based on your profile and history.
            </p>
            {stocksRanking?.slice(0, stocksToShow).map((stock, index) => (
                <div className="mb-4">
                    <Link
                        to={`/search/stocks/${stock.ticker}`}
                        className="stock-link"
                    >
                        <Card key={stock.id} className="stock-rank-card">
                            <div>
                                <Card.Img variant="top" src={stock.logo} />
                                <p
                                    className={`stock-rank fs-3 ${
                                        index === 0 ? "text-primary" : ""
                                    }`}
                                >
                                    {index + 1}
                                </p>
                            </div>
                            <Card.Body>
                                <Card.Text className="text-center">
                                    {stock.name} ({stock.ticker})
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
            ))}
            {stocksRanking?.length > stocksToShow ? (
                <Button
                    className="mb-5 mt-4"
                    variant="outline-primary"
                    onClick={() =>
                        setStocksToShow((prev) => prev + STOCKS_TO_SHOW)
                    }
                >
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
