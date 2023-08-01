import "./ProfileHistory.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Card from "react-bootstrap/Card";
import { Context } from "../../context";

export default function ProfileHistory({ username }) {
    const [followsHistory, setFollowsHistory] = useState([]);
    const [likesHistory, setLikesHistory] = useState([]);
    const [dislikesHistory, setDislikesHistory] = useState([]);
    const { setErrorMessage } = useContext(Context);
    const [mode, setMode] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [followsResponse, likesResponse, dislikesResponse] =
                    await Promise.all([
                        axios.get(
                            `${
                                import.meta.env.VITE_HOST
                            }/follows/user/${username}`,
                            {
                                withCredentials: true,
                                validateStatus: () => true
                            }
                        ),
                        axios.get(
                            `${
                                import.meta.env.VITE_HOST
                            }/likes/user/${username}`,
                            {
                                withCredentials: true,
                                validateStatus: () => true
                            }
                        ),
                        axios.get(
                            `${
                                import.meta.env.VITE_HOST
                            }/dislikes/user/${username}`,
                            {
                                withCredentials: true,
                                validateStatus: () => true
                            }
                        )
                    ]);

                if (followsResponse.status === 200) {
                    setFollowsHistory(followsResponse.data.stocksYouFollow);
                    setLikesHistory(likesResponse.data.stocksYouLike);
                    setDislikesHistory(dislikesResponse.data.stocksYouDislike);
                }

                if (followsResponse.status === 500) {
                    setErrorMessage(
                        `${followsResponse.statusText}: Please try again later.`
                    );
                }
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchHistory();
        setMode([]);
    }, [username]);

    return (
        <>
            <ToggleButtonGroup
                className="mt-5"
                type="radio"
                name="options"
                defaultValue={1}
            >
                <div className="ms-2">
                    <ToggleButton
                        id="tbg-radio-1"
                        value={1}
                        variant="primary"
                        onClick={() => setMode(followsHistory)}
                    >
                        Follows
                    </ToggleButton>
                </div>
                <div className="me-2 ms-2">
                    <ToggleButton
                        id="tbg-radio-2"
                        value={2}
                        variant="success"
                        onClick={() => setMode(likesHistory)}
                    >
                        Likes
                    </ToggleButton>
                </div>
                <div className="me-2">
                    <ToggleButton
                        id="tbg-radio-3"
                        value={3}
                        variant="danger"
                        onClick={() => setMode(dislikesHistory)}
                    >
                        Dislikes
                    </ToggleButton>
                </div>
            </ToggleButtonGroup>
            <div className="container mt-5 mb-5">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {mode?.map((stock) => (
                        <div key={stock.ticker} className="col">
                            <Link
                                to={`/search/stocks/${stock.ticker}`}
                                className="stock-link"
                            >
                                <Card>
                                    <Card.Img variant="top" src={stock.logo} />
                                    <Card.Body>
                                        <Card.Title>{stock.ticker}</Card.Title>
                                        <Card.Text>{stock.name}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
