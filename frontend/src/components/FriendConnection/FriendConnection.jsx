import "./FriendConnection.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { NetworkError, ServerError, ResponseError } from "../../utils";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";

export default function FriendConnection({ username, profile, setProfile }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleFriend = async () => {
        try {
            dispatch(setLoading(true));
            const url = profile.friend
            ? `${import.meta.env.VITE_HOST}/unfriend`
            : `${import.meta.env.VITE_HOST}/friend`;

            const response = await axios.post(
                url,
                { username },
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `You ${
                        profile.friend
                            ? `have unfriended ${username}!`
                            : `are now friends with ${username}!`
                    }`,
                    showConfirmButton: false,
                    timer: 1500
                });
                setProfile({ ...profile, friend: !profile.friend });
            }

            if (response.status === 404 || response.status === 409) {
                ResponseError(response.data.error);
            }

            if (response.status === 500) {
                ServerError();
            }

            dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false));
            NetworkError(error);
        }
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
