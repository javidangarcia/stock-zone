import "./StocksYouFollow.css";
import { UserContext } from "../App/App";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StocksYouFollow({ stocks, setStocks }) {
    const { user, setErrorMessage, setLoading } = useContext(UserContext);

    useEffect(() => {
        const fetchStocksYouFollow = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/follows/user/${user.username}`,
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
            }
        };
        fetchStocksYouFollow();
    }, []);

    return (
        <div className="stocks-you-follow">
            <h1>Stocks You Follow</h1>
            <div className="stocks">
                {stocks?.map((stock) => {
                    return (
                        <div key={stock.ticker} className="stock-margin">
                            <Link
                                key={stock.name}
                                to={`/search/stocks/${stock.ticker}`}
                                className="stock-link"
                            >
                                <div className="stock">
                                    <img
                                        src={stock.logo}
                                        alt={`This is a logo of ${stock.name}.`}
                                    />
                                    <p>{stock.ticker}</p>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
