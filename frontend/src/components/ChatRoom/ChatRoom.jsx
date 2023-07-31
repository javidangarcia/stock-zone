import "./ChatRoom.css";
import { useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import Chat from "../Chat/Chat";
import { Context } from "../../context";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const socket = io.connect("http://localhost:3001");

export default function ChatRoom() {
    const { user, setErrorMessage } = useContext(Context);
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState({});

    useEffect(() => {
        const fetchFriends = async () => {
            try {
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
                    setErrorMessage(response.data.error);
                }
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchFriends();
    }, []);

    const joinRoom = (friend) => {
        const roomID = [friend.user2.username, friend.user1.username]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .join("");

        socket.emit("join_room", roomID);
        setFriend(friend);
        setRoom(roomID);
        setShowChat(true);
    };

    return (
        <div className="chat">
            <div className="friends-list">
                <h3>Friends</h3>
                <Card className="friends-card">
                    <ListGroup variant="flush">
                        {friends.map((friend) => (
                            <ListGroup.Item
                                key={friend.user2.id}
                                className="friends"
                                onClick={() => joinRoom(friend)}
                            >
                                {friend.user2.username}
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
