import "./Ranking.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError, ResponseError } from "../../utils";

const DEFAULT_RANKING_PAGE = 1;
const MAX_PAGE_SIZE = 10;

export default function Ranking() {
    const [stocksRanking, setStocksRanking] = useState([]);
    const [page, setPage] = useState(DEFAULT_RANKING_PAGE);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/ranking/${page}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    if (response.data.stocksRanking.length < MAX_PAGE_SIZE) {
                        setShowLoadMore(false);
                    }

                    if (page === DEFAULT_RANKING_PAGE) {
                        setStocksRanking(response.data.stocksRanking);
                    } else {
                        setStocksRanking((prevRanking) => [
                            ...prevRanking,
                            ...response.data.stocksRanking
                        ]);
                    }
                }

                if (response.status === 422 || response.status === 401) {
                    ResponseError(response.data.error);
                }

                if (response.status === 500) {
                    ServerError();
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError(error);
            }
        };
        fetchRanking();
    }, [page]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <h1 className="mt-4">Popular Stocks</h1>
            <p className="mb-4">
                Recommended based on your profile and history.
            </p>
            {stocksRanking?.map((stock, index) => (
                <div key={stock.id} className="mb-4">
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
            {!loading && showLoadMore ? (
                <Button
                    className="mb-5 mt-4"
                    variant="outline-primary"
                    onClick={() =>
                        setPage((prev) => prev + DEFAULT_RANKING_PAGE)
                    }
                >
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
