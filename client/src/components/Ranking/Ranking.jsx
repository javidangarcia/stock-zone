import "./Ranking.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { fetchRanking } from "../../api/ranking";
import { toast } from "react-toastify";

const DEFAULT_RANKING_PAGE = 1;
const MAX_PAGE_SIZE = 5;

export default function Ranking() {
    const [stocksRanking, setStocksRanking] = useState([]);
    const [page, setPage] = useState(DEFAULT_RANKING_PAGE);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchRanking(page)
            .then(data => {
                if (data.length < MAX_PAGE_SIZE) setShowLoadMore(false);
                setStocksRanking([...stocksRanking, ...data]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [page]);

    return stocksRanking.length > 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <h1 className="mt-4">Popular Stocks</h1>
            <p className="mb-4">
                Recommended based on your profile and history.
            </p>
            {stocksRanking.map((stock, index) => (
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

            {showLoadMore && (
                <Button
                    className="mb-5 mt-4"
                    variant="outline-primary"
                    onClick={() => setPage(prev => prev + DEFAULT_RANKING_PAGE)}
                >
                    Load More
                </Button>
            )}
        </div>
    ) : null;
}
