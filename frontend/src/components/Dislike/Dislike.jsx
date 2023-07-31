import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { Context } from "../../context";

export default function Dislike({ ticker, stockData, setStockData }) {
    const { setErrorMessage } = useContext(Context);
    const [dislikes, setDislikes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDislikes = async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_HOST}/dislikes/stock/${ticker}`,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setDislikes(response.data.dislikes);
            }
        };
        fetchDislikes();
    }, [stockData]);

    async function handleDislike() {
        const url = stockData.disliking
            ? `${import.meta.env.VITE_HOST}/undislike`
            : `${import.meta.env.VITE_HOST}/dislike`;
        try {
            const response = await axios.post(
                url,
                { ticker },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
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
