import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockDislikers } from "../../api/stocks";
import { toast } from "react-toastify";

export default function Dislike({ ticker }) {
    const [dislikers, setDislikers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        toast.dismiss();
        fetchStockDislikers(ticker)
            .then(data => {
                setDislikers(data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, []);
    return (
        <SplitButton
            title="Dislike"
            variant="danger"
            onClick={() => handleDislike()}
            className="me-2"
        >
            <Dropdown.Item>
                {dislikers.length} users follow this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {dislikers.map(disliker => (
                <Dropdown.Item
                    key={disliker.id}
                    onClick={() => navigate(`/profile/${disliker.username}`)}
                >
                    {disliker.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
