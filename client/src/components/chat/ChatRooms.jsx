import "./ChatRooms.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LiveChat from "./LiveChat";
import { setLoading } from "../../redux/loading";
import { Dropdown } from "react-bootstrap";
import { fetchFriends } from "../../api/users";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const socket = io.connect(`${import.meta.env.VITE_SERVER}`);

export default function ChatRooms() {
    const user = useSelector(state => state.user);
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const joinRoom = friend => {
        const roomId = [friend.username, user.username]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .join("");

        socket.emit("join_room", roomId);
        setFriend(friend);
        setRoom(roomId);
        setShowChat(true);
    };

    useEffect(() => {
        dispatch(setLoading(true));
        fetchFriends()
            .then(data => {
                if (data.length === 0) {
                    Swal.fire({
                        icon: "info",
                        title: "Get Started with Messaging",
                        text: "Add any user as a friend to get started.",
                    }).then(result => {
                        if (result.isConfirmed) {
                            navigate(`/profile/${user.username}`);
                        }
                    });
                    return;
                }
                setFriends(data);
                joinRoom(data[0]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return friends.length > 0 ? (
        <div className="chat">
            <div className="friends-list">
                <Card className="friends-card">
                    <ListGroup variant="flush">
                        {friends.map(friend => (
                            <ListGroup.Item
                                key={friend.id}
                                className="friends"
                                onClick={() => joinRoom(friend)}
                            >
                                <div className="d-flex justify-content-between mb-1 mt-1">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <img
                                            src={friend.picture}
                                            alt={friend.username}
                                            className="friend-picture"
                                        />
                                        <p className="m-0">{friend.name}</p>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="link"
                                            id={`dropdown-${friend.id}`}
                                            bsPrefix="none"
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${friend.username}`
                                                    )
                                                }
                                            >
                                                View Profile
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            </div>
            {showChat && (
                <LiveChat socket={socket} room={room} friend={friend} />
            )}
        </div>
    ) : null;
}
