import "./FriendConnection.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";

export default function FriendConnection({ username, profile, setProfile }) {
    const user = useSelector((state) => state.user);

    const handleFriend = async () => {
        const url = profile.friend
            ? `${import.meta.env.VITE_HOST}/unfriend`
            : `${import.meta.env.VITE_HOST}/friend`;
        try {
            const response = await axios.post(
                url,
                { username },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setProfile({ ...profile, friend: !profile.friend });
            }

            if (response.status === 404 || response.status === 409) {
            }

            if (response.status === 500) {
            }
        } catch (error) {}
    };

    return (
        <div className={username === user.username ? "hidden" : ""}>
            <Button
                className="friend-button"
                variant="primary"
                onClick={handleFriend}
            >
                {profile.friend ? "Remove Friend" : "Add Friend"}
            </Button>
        </div>
    );
}
