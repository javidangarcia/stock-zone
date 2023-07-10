import "./Follow.css";
import axios from "axios";

export default function Follow({ ticker, stockData, setStockData }) {
    async function handleFollow() {
        try {
            const response = await axios.post(
                "http://localhost:3000/follow",
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setStockData({ ...stockData, following: true });
            }

            if (response.status === 409) {
                alert(response.data.error);
            }
        } catch (error) {}
    }

    async function handleUnfollow() {
        try {
            const response = await axios.post(
                "http://localhost:3000/unfollow",
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setStockData({ ...stockData, following: false });
            }

            if (response.status === 404) {
                alert(response.data.error);
            }
        } catch (error) {}
    }

    return (
        <div className="follow">
            {stockData.following ? (
                <button onClick={handleUnfollow}>Following</button>
            ) : (
                <button onClick={handleFollow}>Follow</button>
            )}
        </div>
    );
}
