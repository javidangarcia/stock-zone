import "./StockCarousel.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { fetchStocks } from "../../api/stocks";
import { toast } from "react-toastify";

export default function StockCarousel() {
    const [stocks, setStocks] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        toast.dismiss();
        dispatch(setLoading(true));
        fetchStocks()
            .then(data => setStocks(data))
            .catch(error => toast.error(error.message))
            .finally(() => dispatch(setLoading(false)));
    }, []);

    return (
        <Carousel
            className="carousel mb-5"
            data-bs-theme="light"
            interval={700}
        >
            {stocks.map(stock => (
                <Carousel.Item key={stock.ticker} className="carousel-item">
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
    );
}
