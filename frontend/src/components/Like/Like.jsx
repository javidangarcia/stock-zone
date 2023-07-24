import axios from "axios";
import { UserContext } from "../App/App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";

export default function Like({ ticker, stockData, setStockData }) {
    const { setErrorMessage } = useContext(UserContext);
    const [likes, setLikes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikes = async () => {
            const response = await axios.get(
                `http://localhost:3000/likes/stock/${ticker}`,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setLikes(response.data.likes);
            }
        };
        fetchLikes();
    }, [stockData]);

    async function handleLike() {
        const url = stockData.liking
            ? "http://localhost:3000/unlike"
            : "http://localhost:3000/like";
        try {
            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
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
                setErrorMessage(response.data.error);
            }

            if (response.status === 500) {
                setErrorMessage(
                    `${response.statusText}: Please try again later.`
                );
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    }

    return (
        <SplitButton
            title={stockData.liking ? "Liked" : "Like"}
            variant="success"
            onClick={handleLike}
            className="me-2"
        >
            <Dropdown.Item>{likes.length} users like this stock.</Dropdown.Item>
            <Dropdown.Divider />
            {likes?.map((like) => {
                return (
                    <Dropdown.Item
                        key={like.User.username}
                        onClick={() =>
                            navigate(`/profile/${like.User.username}`)
                        }
                    >
                        {like.User.username}
                    </Dropdown.Item>
                );
            })}
        </SplitButton>
    );
}
