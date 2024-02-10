import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockFollowers } from "../../api/stocks";
import { toast } from "react-toastify";

export default function Follow({ ticker }) {
    const [followers, setFollowers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        toast.dismiss();
        fetchStockFollowers(ticker)
            .then(data => {
                setFollowers(data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, []);

    const handleFollow = () => {};

    return (
        <SplitButton
            title="Follow"
            variant="primary"
            onClick={() => handleFollow()}
            className="me-2"
        >
            <Dropdown.Item>
                {followers.length} users follow this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {followers.map(follower => (
                <Dropdown.Item
                    key={follower.id}
                    onClick={() => navigate(`/profile/${follower.username}`)}
                >
                    {follower.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
