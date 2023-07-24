import axios from "axios";
import { UserContext } from "../App/App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";

export default function Follow({ ticker, stockData, setStockData }) {
    const { setErrorMessage } = useContext(UserContext);
    const [follows, setFollows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollows = async () => {
            const response = await axios.get(
                `http://localhost:3000/follows/stock/${ticker}`,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setFollows(response.data.follows);
            }
        };
        fetchFollows();
    }, [stockData]);

    async function handleFollow() {
        const url = stockData.following
            ? "http://localhost:3000/unfollow"
            : "http://localhost:3000/follow";
        try {
            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setStockData({ ...stockData, following: !stockData.following });
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
            title={stockData.following ? "Following" : "Follow"}
            variant="primary"
            onClick={handleFollow}
            className="me-2"
        >
            <Dropdown.Item>
                {follows.length} users follow this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {follows?.map((follow) => {
                return (
                    <Dropdown.Item
                        key={follow.User.username}
                        onClick={() =>
                            navigate(`/profile/${follow.User.username}`)
                        }
                    >
                        {follow.User.username}
                    </Dropdown.Item>
                );
            })}
        </SplitButton>
    );
}
