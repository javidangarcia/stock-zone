import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { NetworkError, ServerError, ResponseError } from "../../utils";
import { setLoading } from "../../redux/loading";

export default function Like({ ticker, stockData, setStockData }) {
    const [likes, setLikes] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/likes/stock/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setLikes(response.data.likes);
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
        fetchLikes();
    }, [stockData]);

    async function handleLike() {
        try {
            dispatch(setLoading(true));
            const url = stockData.liking
                ? `${import.meta.env.VITE_HOST}/unlike`
                : `${import.meta.env.VITE_HOST}/like`;

            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `You ${
                        stockData.liking
                            ? `have unliked ${stockData.ticker}!`
                            : `are now liking ${stockData.ticker}!`
                    }`,
                    showConfirmButton: false,
                    timer: 1500
                });
                const disliking =
                    stockData.disliking && !stockData.liking
                        ? false
                        : stockData.disliking;

                setStockData({
                    ...stockData,
                    liking: !stockData.liking,
                    disliking
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
            title={stockData.liking ? "Liked" : "Like"}
            variant="success"
            onClick={() => handleLike()}
            className="me-2"
        >
            <Dropdown.Item>{likes.length} users like this stock.</Dropdown.Item>
            <Dropdown.Divider />
            {likes?.map((like) => (
                <Dropdown.Item
                    key={like.User.username}
                    onClick={() => navigate(`/profile/${like.User.username}`)}
                >
                    {like.User.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
