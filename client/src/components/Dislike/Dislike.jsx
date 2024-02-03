import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { NetworkError, ServerError, ResponseError } from "../../utils";
import { setLoading } from "../../redux/loading";

export default function Dislike({ ticker, stockData, setStockData }) {
    const [dislikes, setDislikes] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDislikes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/dislikes/stock/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setDislikes(response.data.dislikes);
                }

                if (response.status === 404) {
                    ResponseError(response.data.error);
                }

                if (response.status === 500) {
                    ServerError();
                }
            } catch (error) {
                NetworkError(error);
            }
        };
        fetchDislikes();
    }, [stockData]);

    async function handleDislike() {
        try {
            dispatch(setLoading(true));
            const url = stockData.disliking
                ? `${import.meta.env.VITE_HOST}/undislike`
                : `${import.meta.env.VITE_HOST}/dislike`;

            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `You ${
                        stockData.disliking
                            ? `have undisliked ${stockData.ticker}!`
                            : `are now disliking ${stockData.ticker}!`
                    }`,
                    showConfirmButton: false,
                    timer: 1500
                });
                const liking =
                    stockData.liking && !stockData.disliking
                        ? false
                        : stockData.liking;

                setStockData({
                    ...stockData,
                    disliking: !stockData.disliking,
                    liking
                });
            }

            if (
                response.status === 400 ||
                response.status === 401 ||
                response.status === 404 ||
                response.status === 409
            ) {
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
    }

    return (
        <SplitButton
            title={stockData.disliking ? "Disliked" : "Dislike"}
            variant="danger"
            onClick={() => handleDislike()}
            className="me-2"
        >
            <Dropdown.Item>
                {dislikes.length} users dislike this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {dislikes?.map((dislike) => (
                <Dropdown.Item
                    key={dislike.User.username}
                    onClick={() =>
                        navigate(`/profile/${dislike.User.username}`)
                    }
                >
                    {dislike.User.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
