import "./Dislike.css";
import axios from "axios";
import { UserContext } from "../App/App";
import { useContext } from "react";

export default function Dislike({ ticker, stockData, setStockData }) {
    const { setErrorMessage } = useContext(UserContext);

    async function handleDislike() {
        const url = stockData.disliking
            ? "http://localhost:3000/undislike"
            : "http://localhost:3000/dislike";
        try {
            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                stockData.liking && !stockData.disliking
                    ? setStockData({
                          ...stockData,
                          disliking: !stockData.disliking,
                          liking: false
                      })
                    : setStockData({
                          ...stockData,
                          disliking: !stockData.disliking
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
        <div className="dislike">
            <button onClick={handleDislike}>
                {stockData.disliking ? "Disliked" : "Dislike"}
            </button>
        </div>
    );
}
