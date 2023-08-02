import "./Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { setLoading } from "../../redux/loading";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStocksYouFollow = async () => {
            try {
                dispatch(setLoading(true));
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
                }

                if (response.status === 500) {
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
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
