import "./ChatRoom.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Chat from "../Chat/Chat";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError } from "../../utils";
import { Dropdown } from "react-bootstrap";

const socket = io.connect(`${import.meta.env.VITE_SOCKET}`);

export default function ChatRoom() {
    const user = useSelector((state) => state.user);
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState({});
    const dispatch = useDispatch();
    const [hasRendered, setHasRendered] = useState(false);
    const navigate = useNavigate();

    const joinRoom = (connection) => {
        const roomID = [connection.user2.username, connection.user1.username]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .join("");

        socket.emit("join_room", roomID);
        setFriend(connection);
        setRoom(roomID);
        setShowChat(true);
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/friends`,
                    {
                        withCredentials: true,
                        validateStatus: () => true
                    }
                );

                if (response.status === 200) {
                    setFriends(response.data.friends);

                    if (response.data.friends.length > 0) {
                        joinRoom(response.data.friends[0]);
                    } else {
                        Swal.fire({
                            icon: "info",
                            title: "Get Started with Messaging",
                            text: "Add any user as a friend to get started."
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate(`/profile/${user.username}`);
                            }
                        });
                    }
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

        if (hasRendered) {
            fetchFriends();
        } else {
            setHasRendered(true);
        }
    }, [hasRendered]);

    return friends.length > 0 ? (
        <div className="chat">
            <div className="friends-list">
                <Card className="friends-card">
                    <ListGroup variant="flush">
                        {friends.map((connection) => (
                            <ListGroup.Item
                                key={connection.user2.id}
                                className="friends"
                                onClick={() => joinRoom(connection)}
                            >
                                <div className="d-flex justify-content-between mb-1 mt-1">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <img
                                            src={connection.user2.picture}
                                            alt={connection.user2.username}
                                            className="friend-picture"
                                        />
                                        <p className="m-0">
                                            {connection.user2.fullName}
                                        </p>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="link"
                                            id={`dropdown-${connection.user2.id}`}
                                            bsPrefix="none"
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/${connection.user2.username}`
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
                <Chat socket={socket} user={user} room={room} friend={friend} />
            )}
        </div>
    ) : null;
}
