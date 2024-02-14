import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StockNews from "./StockNews";
import StocksYouFollow from "./StocksYouFollow";
import { setLoading } from "../../redux/loading";
import { fetchFollowedStocks } from "../../api/users";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [stocks, setStocks] = useState([]);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchFollowedStocks(user.username)
            .then(data => {
                if (data.length === 0) {
                    Swal.fire({
                        icon: "info",
                        title: "Get Started with Stock Zone",
                        text: "Follow any stock to get started.",
                    }).then(result => {
                        if (result.isConfirmed) {
                            navigate(`/search`);
                        }
                    });
                    return;
                }
                setStocks(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return stocks.length > 0 ? (
        <div className="d-flex w-100">
            <StockNews stocks={stocks} />
            <StocksYouFollow stocks={stocks} />
        </div>
    ) : null;
}
