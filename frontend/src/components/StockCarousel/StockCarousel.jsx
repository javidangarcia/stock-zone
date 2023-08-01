import "./StockCarousel.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../context";
import Carousel from "react-bootstrap/Carousel";

export default function StockCarousel() {
    const [stocks, setStocks] = useState([]);
    const [stocksNotFound, setStocksNotFound] = useState(false);
    const { setErrorMessage, setLoading } = useContext(Context);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/stocks`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStocks(response.data.stocks);
                }

                if (response.status === 404) {
                    setStocksNotFound(true);
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
        fetchStocks();
    }, []);

    return (
        <>
            {stocksNotFound ? (
                <div
                    className="alert alert-danger d-flex justify-content-center"
                    role="alert"
                >
                    There are no stocks currently in the database, search for a
                    stock to gain access to the table.
                </div>
            ) : null}

            {stocks.length > 0 ? (
                <Carousel className="carousel mb-5" data-bs-theme="light" interval={700}>
                    {stocks.map((stock) => (
                        <Carousel.Item
                            key={stock.ticker}
                            className="carousel-item"
                        >
                            <Link
                                to={`/search/stocks/${stock.ticker}`}
                                className="stock-link"
                            >
                                <img
                                    className="d-block w-100"
                                    src={stock.logo}
                                    alt={stock.name}
                                />
                            </Link>
                            <Carousel.Caption>
                                <div className="text-white carousel-info">
                                    <h5>{stock.ticker}</h5>
                                    <p>{stock.name}</p>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : null}
        </>
    );
}
