import "./Home.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { setLoading } from "../../redux/loading";
import { fetchStocksFollowedByUser } from "../../api/users";
import { toast } from "react-toastify";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [newsView, setNewsView] = useState(false);
    const [stocksView, setStocksView] = useState(false);

    useEffect(() => {
        dispatch(setLoading(true));
        fetchStocksFollowedByUser(user)
            .then(data => {
                if (data.length > 0) {
                    setStocks(data);
                    setStocksView(true);
                } else {
                    toast.info("Follow any stock to get started.", {
                        toastId: "info",
                    });
                    setNewsView(true);
                }
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return (
        <div className="home">
            {newsView ? <StockNews stocks={stocks} /> : null}

            {stocksView ? (
                <>
                    <StockNews stocks={stocks} />
                    <StocksYouFollow stocks={stocks} />
                </>
            ) : null}
        </div>
    );
}
