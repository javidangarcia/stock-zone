import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { fetchStockDislikers } from "../../api/stocks";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { dislikeStock, undislikeStock } from "../../api/interactions";

export default function Dislike({
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
        fetchStockDislikers(ticker)
            .then(data => {
                setDislikers(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
    }, []);

    const handleDislike = () => {
        dispatch(setLoading(true));
        dislikeStock(ticker)
            .then(() => {
                setDislikers([...dislikers, user]);
                setLikers(likers.filter(liker => liker.id !== user.id));
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const handleUndislike = () => {
        dispatch(setLoading(true));
        undislikeStock(ticker)
            .then(() => {
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

    return (
        <SplitButton
            title={
                dislikers.some(disliker => disliker.id === user.id)
                    ? "Disliked"
                    : "Dislike"
            }
            variant="danger"
            onClick={() => {
                if (dislikers.some(disliker => disliker.id === user.id)) {
                    handleUndislike();
                } else {
                    handleDislike();
                }
            }}
            className="me-2"
        >
            <Dropdown.Item>
                {dislikers.length} users dislike this stock.
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
