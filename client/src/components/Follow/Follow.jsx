import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { NetworkError, ServerError, ResponseError } from "../../utils";
import { setLoading } from "../../redux/loading";

export default function Follow({ ticker, stockData, setStockData }) {
    const [follows, setFollows] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFollows = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/follows/stock/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setFollows(response.data.follows);
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
        fetchFollows();
    }, [stockData]);

    async function handleFollow() {
        try {
            dispatch(setLoading(true));
            const url = stockData.following
                ? `${import.meta.env.VITE_HOST}/unfollow`
                : `${import.meta.env.VITE_HOST}/follow`;

            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `You ${
                        stockData.following
                            ? `have unfollowed ${stockData.ticker}!`
                            : `are now following ${stockData.ticker}!`
                    }`,
                    showConfirmButton: false,
                    timer: 1500
                });
                setStockData({ ...stockData, following: !stockData.following });
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
            title={stockData.following ? "Following" : "Follow"}
            variant="primary"
            onClick={() => handleFollow()}
            className="me-2"
        >
            <Dropdown.Item>
                {follows.length} users follow this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {follows?.map((follow) => (
                <Dropdown.Item
                    key={follow.User.username}
                    onClick={() => navigate(`/profile/${follow.User.username}`)}
                >
                    {follow.User.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
