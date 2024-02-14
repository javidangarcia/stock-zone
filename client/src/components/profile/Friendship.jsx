import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { useEffect, useState } from "react";
import { addFriend, fetchFriends, removeFriend } from "../../api/users";
import { toast } from "react-toastify";

export default function Friendship({ profile }) {
    const { username } = profile;
    const [friends, setFriends] = useState([]);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchFriends()
            .then(data => {
                setFriends(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    const handleAddFriend = async () => {
        dispatch(setLoading(true));
        addFriend(username)
            .then(() => {
                setFriends([...friends, { ...profile }]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const handleRemoveFriend = async () => {
        dispatch(setLoading(true));
        removeFriend(username)
            .then(() => {
                setFriends(
                    friends.filter(friend => friend.username !== username)
                );
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return username !== user.username ? (
        <div>
            <Button
                className="position-absolute"
                style={{ top: "10px", right: "10px" }}
                variant="primary"
                onClick={() => {
                    if (friends.some(friend => friend.username === username)) {
                        handleRemoveFriend();
                    } else {
                        handleAddFriend();
                    }
                }}
            >
                {friends.some(friend => friend.username === username)
                    ? "Remove Friend"
                    : "Add Friend"}
            </Button>
        </div>
    ) : null;
}
