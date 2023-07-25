import "./StocksYouFollow.css";
import { UserContext } from "../App/App";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function StocksYouFollow({ stocks, setStocks }) {
    const { user, setErrorMessage, setLoading } = useContext(UserContext);
    const [displayedStocks, setDisplayedStocks] = useState(3);
    const [loadedLogos, setLoadedLogos] = useState({});

    useEffect(() => {
        const fetchStocksYouFollow = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/follows/user/${
                        user.username
                    }`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStocks(response.data.stocksYouFollow);
                }

                if (response.status === 404) {
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
                setLoading(false);
            }
        };
        fetchStocksYouFollow();
    }, []);

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
                        .map((stock) => {
                            return (
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
                                    <td className="text-center">
                                        ${stock.price}
                                    </td>
                                    <td className="text-center">
                                        {stock.sector}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
            {stocks.length > displayedStocks ? (
                <Button
                    variant="outline-primary"
                    onClick={() => setDisplayedStocks((prev) => prev + 3)}
                >
                    Load More
                </Button>
            ) : null}
        </div>
    ) : null;
}
