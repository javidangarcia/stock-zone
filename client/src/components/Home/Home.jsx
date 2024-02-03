import "./Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError, ResponseError } from "../../utils";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [newsView, setNewsView] = useState(false);
    const [stocksView, setStocksView] = useState(false);
    const [hasRendered, setHasRendered] = useState(false);

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
                    if (response.data.stocksYouFollow.length > 0) {
                        setStocks(response.data.stocksYouFollow);
                        setStocksView(true);
                    } else {
                        dispatch(setLoading(false));
                        Swal.fire({
                            icon: "info",
                            title: "Get Started with Stock Zone",
                            text: "Follow any stock to get started."
                        });
                        setNewsView(true);
                        return;
                    }
                }

                if (response.status === 404) {
                    ResponseError(response.data.error);
                }

                if (response.status === 500) {
                    ServerError();
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError(error);
            }
        };

        if (hasRendered) {
            fetchStocksYouFollow();
        } else {
            setHasRendered(true);
        }
    }, [hasRendered]);

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
