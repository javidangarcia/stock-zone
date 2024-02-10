import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Card from "react-bootstrap/Card";
import {
    fetchFollowedStocks,
    fetchLikedStocks,
    fetchDislikedStocks,
} from "../../api/users";
import { toast } from "react-toastify";

export default function UserActivity({ username }) {
    const [followedStocks, setFollowedStocks] = useState([]);
    const [likedStocks, setLikedStocks] = useState([]);
    const [dislikedStocks, setDislikedStocks] = useState([]);
    const [activeCategory, setActiveCategory] = useState([]);

    useEffect(() => {
        fetchFollowedStocks(username)
            .then(data => {
                setFollowedStocks(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });

        fetchLikedStocks(username)
            .then(data => {
                setLikedStocks(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });

        fetchDislikedStocks(username)
            .then(data => {
                setDislikedStocks(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
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
                        onClick={() => setActiveCategory([...followedStocks])}
                    >
                        Following
                    </ToggleButton>
                </div>
                <div className="me-2 ms-2">
                    <ToggleButton
                        id="tbg-radio-2"
                        value={2}
                        variant="success"
                        onClick={() => setActiveCategory([...likedStocks])}
                    >
                        Liked
                    </ToggleButton>
                </div>
                <div className="me-2">
                    <ToggleButton
                        id="tbg-radio-3"
                        value={3}
                        variant="danger"
                        onClick={() => setActiveCategory([...dislikedStocks])}
                    >
                        Disliked
                    </ToggleButton>
                </div>
            </ToggleButtonGroup>
            <div className="container mt-5 mb-5">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {activeCategory.map(stock => (
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
