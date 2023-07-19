import "./SearchTable.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SearchTable() {
    const [stocks, setStocks] = useState([]);
    const [stocksNotFound, setStocksNotFound] = useState(false);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get("http://localhost:3000/stocks");

                if (response.status === 200) {
                    setStocks(response.data.stocks);
                }

                if (response.status === 404) {
                    setStocksNotFound(true);
                    setErrorMessage(response.data.error);
                }

                if (response.status === 500) {
                    setErrorMessage(`${response.statusText}: Please try again later.`);
                }
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        }
        fetchStocks();
    }, []);

    return (
        stocksNotFound ? (
            <p>There are no stocks currently in the database, search for a stock to gain access to table.</p>
        ) : (
            <table className="search-table">
                <tbody>
                    <tr>
                        <th>Logo</th>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Sector</th>
                        <th>Price</th>
                    </tr>
                </tbody>
                {stocks?.map((stock) => {
                    return (
                        <tbody key={stock.name}>
                            <tr>
                                <td id="stock-logo">
                                    <img
                                        src={stock.logo}
                                        alt={`This is a logo of ${stock.name}.`}
                                    />
                                </td>
                                <td id="stock-ticker">
                                    <Link
                                        key={stock.name}
                                        to={`/search/stocks/${stock.ticker}`}
                                        className="stock-link"
                                    >
                                        {stock.ticker}
                                    </Link>
                                </td>
                                <td>{stock.name}</td>
                                <td>{stock.sector}</td>
                                <td>${stock.price?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    );
                })}
            </table>
        )
    );
}