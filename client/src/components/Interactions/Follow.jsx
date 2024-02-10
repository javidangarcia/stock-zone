import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockFollowers } from "../../api/stocks";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { followStock, unfollowStock } from "../../api/interactions";

export default function Follow({ ticker }) {
    const [followers, setFollowers] = useState([]);
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchStockFollowers(ticker)
            .then(data => {
                setFollowers(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
    }, []);

    const handleFollow = () => {
        dispatch(setLoading(true));
        followStock(ticker)
            .then(() => {
                setFollowers([...followers, user]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const handleUnfollow = () => {
        dispatch(setLoading(true));
        unfollowStock(ticker)
            .then(() => {
                setFollowers(
                    followers.filter(follower => follower.id !== user.id)
                );
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <SplitButton
            title={
                followers.some(follower => follower.id === user.id)
                    ? "Following"
                    : "Follow"
            }
            variant="primary"
            onClick={() => {
                if (followers.some(follower => follower.id === user.id)) {
                    handleUnfollow();
                } else {
                    handleFollow();
                }
            }}
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
