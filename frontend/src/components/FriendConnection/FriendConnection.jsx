import "./FriendConnection.css";
import axios from "axios";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import { Context } from "../../context";

export default function FriendConnection({ username, profile, setProfile }) {
    const { user, setErrorMessage } = useContext(Context);

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
                setErrorMessage(response.data.error);
            }

            if (response.status === 500) {
                setErrorMessage(
                    `${response.statusText}: Please try again later.`
                );
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    };

    return (
        <div className={username === user.username ? "hidden" : ""}>
            <Button className="friend-button" variant="primary" onClick={handleFriend}>
                {profile.friend ? "Remove Friend" : "Add Friend"}
            </Button>
        </div>
    );
}
