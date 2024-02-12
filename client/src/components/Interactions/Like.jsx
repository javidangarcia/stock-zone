import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockLikers } from "../../api/stocks";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { likeStock, unlikeStock } from "../../api/interactions";

export default function Like({
    ticker,
    likers,
    setLikers,
    dislikers,
    setDislikers,
}) {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchStockLikers(ticker)
            .then(data => {
                setLikers(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
    }, []);

    const handleLike = () => {
        dispatch(setLoading(true));
        likeStock(ticker)
            .then(() => {
                setLikers([...likers, user]);
                setDislikers(
                    dislikers.filter(disliker => disliker.id !== user.id)
                );
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const handleUnlike = () => {
        dispatch(setLoading(true));
        unlikeStock(ticker)
            .then(() => {
                setLikers(likers.filter(liker => liker.id !== user.id));
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
                likers.some(liker => liker.id === user.id) ? "Liked" : "Like"
            }
            variant="success"
            onClick={() => {
                if (likers.some(liker => liker.id === user.id)) {
                    handleUnlike();
                } else {
                    handleLike();
                }
            }}
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
