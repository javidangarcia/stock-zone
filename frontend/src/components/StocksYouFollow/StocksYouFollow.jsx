import "./StocksYouFollow.css";
import { UserContext } from "../App/App";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StocksYouFollow({ stocks, setStocks }) {
    const { setError } = useContext(UserContext);

    useEffect(() => {
        const fetchStocksYouFollow = async () => {
            try {
                const response = await axios.get("http://localhost:3000/follows", { withCredentials: true });
                setStocks(response.data.stocks);
            } catch (error) {
                setError(`${error.message}: Please try again later.`);
            }
            
        };
        fetchStocksYouFollow();
    }, []);

    return (
        <div className="stocks-you-follow">
            <h1>Stocks You Follow</h1>
            <div className="stocks">
                {
                    stocks?.map((stock) => {
                        return (
                            <div key={stock.ticker} className="stock-margin">
                                <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                    <div className="stock">
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                        <p>{stock.ticker}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
