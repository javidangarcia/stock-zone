import "./Follow.css";
import axios from "axios";
import { UserContext } from "../App/App";
import { useContext } from "react";

export default function Follow({ ticker, stockData, setStockData }) {
    const { setError } = useContext(UserContext);

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

            if (response.status === 400 || response.status === 401 || response.status === 404 || response.status === 409) {
                setError(response.data.error);
            }

            if (response.status === 500) {
                setError(`${response.statusText}: Please try again later.`);
            }
        } catch (error) {
            setError(`${error.message}: Please try again later.`);
        }
    }

    return (
        <div className="follow">
            <button onClick={handleFollow}>
                {stockData.following ? "Following" : "Follow"}
            </button>
        </div>
    );
}
