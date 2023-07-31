import "./Home.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { Context } from "../../context";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    const { user, setErrorMessage, setLoading } = useContext(Context);

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
        <div className="home">
            <StockNews stocks={stocks} />
            <StocksYouFollow stocks={stocks} />
        </div>
    ) : null;
}
