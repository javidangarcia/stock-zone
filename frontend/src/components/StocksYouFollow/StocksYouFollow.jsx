import "./StocksYouFollow.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const STOCKS_TO_DISPLAY = 3;

export default function StocksYouFollow({ stocks }) {
    const [displayedStocks, setDisplayedStocks] = useState(STOCKS_TO_DISPLAY);
    const [loadedLogos, setLoadedLogos] = useState({});

    return stocks.length > 0 ? (
        <div className="stocks-you-follow">
            <h1>Stocks You Follow</h1>
            <Table
                className="rounded-table"
                striped
                bordered
                hover
                variant="dark"
            >
                <thead>
                    <tr>
                        <th className="text-center">Logo</th>
                        <th className="text-center">Ticker</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Sector</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks
                        .slice(0, Math.min(displayedStocks, stocks.length))
                        .map((stock) => (
                            <tr key={stock.ticker}>
                                <td className="stock-image">
                                    <div className="stock-follow-logo">
                                        <img
                                            src={stock.logo}
                                            alt={`This is a logo of ${stock.name}.`}
                                            onLoad={() =>
                                                setLoadedLogos((prev) => ({
                                                    ...prev,
                                                    [stock.ticker]: true
                                                }))
                                            }
                                            style={{
                                                visibility: loadedLogos[
                                                    stock.ticker
                                                ]
                                                    ? "visible"
                                                    : "hidden"
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="text-center">
                                    <Link
                                        className="stock-link"
                                        to={`/search/stocks/${stock.ticker}`}
                                    >
                                        {stock.ticker}
                                    </Link>
                                </td>
                                <td className="text-center">${stock.price}</td>
                                <td className="text-center">{stock.sector}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {stocks.length > displayedStocks ? (
                <Button
                    variant="outline-primary"
                    onClick={() =>
                        setDisplayedStocks((prev) => prev + STOCKS_TO_DISPLAY)
                    }
                >
                    Load More
                </Button>
            ) : null}
        </div>
    ) : null;
}
