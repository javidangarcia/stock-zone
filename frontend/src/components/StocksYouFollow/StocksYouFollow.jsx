import "./StocksYouFollow.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const STOCKS_TO_DISPLAY = 3;

export default function StocksYouFollow({ stocks }) {
    const [displayedStocks, setDisplayedStocks] = useState(STOCKS_TO_DISPLAY);

    return stocks.length > 0 ? (
        <div className="stocks-you-follow">
            <h1>Stocks You Follow</h1>
            {stocks
                .slice(0, Math.min(displayedStocks, stocks.length))
                .map((stock) => (
                    <div className="mb-4">
                        <Link
                            to={`/search/stocks/${stock.ticker}`}
                            className="stock-link"
                        >
                            <Card
                                key={stock.id}
                                className="stock-you-follow bg-dark text-white border-3"
                            >
                                <Card.Img variant="top" src={stock.logo} />
                                <Card.Body>
                                    <Card.Text className="text-center">
                                        {stock.name} ({stock.ticker})
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div>
                ))}
            {stocks.length > displayedStocks ? (
                <Button
                    variant="outline-primary"
                    onClick={() =>
                        setDisplayedStocks((prev) => prev + STOCKS_TO_DISPLAY)
                    }
                    className="mb-4"
                >
                    Load More
                </Button>
            ) : null}
        </div>
    ) : null;
}
