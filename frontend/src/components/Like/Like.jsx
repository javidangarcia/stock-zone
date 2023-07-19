import "./Like.css";
import axios from "axios";
import { UserContext } from "../App/App";
import { useContext } from "react";

export default function Like({ ticker, stockData, setStockData }) {
    const { setErrorMessage } = useContext(UserContext);

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
                stockData.disliking && !stockData.liking
                    ? setStockData({
                          ...stockData,
                          liking: !stockData.liking,
                          disliking: false
                      })
                    : setStockData({ ...stockData, liking: !stockData.liking });
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
        <div className="like">
            <button onClick={handleLike}>
                {stockData.liking ? "Liked" : "Like"}
            </button>
        </div>
    );
}
