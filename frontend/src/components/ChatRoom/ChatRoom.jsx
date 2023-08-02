import "./ChatRoom.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import Chat from "../Chat/Chat";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError } from "../../utils";

const socket = io.connect("http://localhost:3001");

export default function ChatRoom() {
    const user = useSelector((state) => state.user);
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState({});
    const dispatch = useDispatch();

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
        fetchFriends();
    }, []);

    const joinRoom = (connection) => {
        const roomID = [connection.user2.username, connection.user1.username]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .join("");

        socket.emit("join_room", roomID);
        setFriend(connection);
        setRoom(roomID);
        setShowChat(true);
    };

    return (
        <div className="chat">
            <div className="friends-list">
                <h3>Friends</h3>
                <Card className="friends-card">
                    <ListGroup variant="flush">
                        {friends.map((connection) => (
                            <ListGroup.Item
                                key={connection.user2.id}
                                className="friends"
                                onClick={() => joinRoom(connection)}
                            >
                                {connection.user2.username}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            </div>
            {showChat && (
                <Chat socket={socket} user={user} room={room} friend={friend} />
            )}
        </div>
    );
}
