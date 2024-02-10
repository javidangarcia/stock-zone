import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockLikers } from "../../api/stocks";
import { toast } from "react-toastify";

export default function Like({ ticker }) {
    const [likers, setLikers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        toast.dismiss();
        fetchStockLikers(ticker)
            .then(data => {
                setLikers(data);
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, []);

    return (
        <SplitButton
            title="Like"
            variant="success"
            onClick={() => handleLike()}
            className="me-2"
        >
            <Dropdown.Item>
                {likers.length} users like this stock.
            </Dropdown.Item>
            <Dropdown.Divider />
            {likers.map(liker => (
                <Dropdown.Item
                    key={liker.id}
                    onClick={() => navigate(`/profile/${liker.username}`)}
                >
                    {liker.username}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
}
