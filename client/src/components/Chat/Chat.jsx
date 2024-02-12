import "./Chat.css";
import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils";
import { setLoading } from "../../redux/loading";
import { fetchMessages, sendMessage } from "../../api/messages";
import { toast } from "react-toastify";

export default function Chat({ socket, room, friend }) {
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        dispatch(setLoading(true));
        fetchMessages(friend.id)
            .then(data => {
                setMessages(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [room]);

    useEffect(() => {
        socket.on("receive_message", data => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => socket.removeListener("receive_message");
    }, [socket]);

    const handleSendMessage = event => {
        event.preventDefault();
        dispatch(setLoading(true));
        sendMessage(friend.id, room, messageInput)
            .then(data => {
                socket.emit("send_message", data);
                setMessageInput("");
                setMessages([...messages, data]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <div className="chat-section">
            <ScrollToBottom className="chat-window">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={
                            message.senderid === user.id
                                ? "your-messages"
                                : "friend-messages"
                        }
                    >
                        <div className="message-bubble">
                            <img
                                src={
                                    message.senderid === user.id
                                        ? user.picture
                                        : friend.picture
                                }
                                alt={`This is the profile of ${
                                    message.senderid === user.id
                                        ? user.username
                                        : friend.username
                                }.`}
                                className="profile-picture"
                            />
                            <div>
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                                <div className="message-footer">
                                    <Link
                                        to={`/profile/${
                                            message.senderid === user.id
                                                ? user.username
                                                : friend.username
                                        }`}
                                        className="user-link"
                                    >
                                        <p
                                            className={
                                                message.senderid === user.id
                                                    ? "message-author text-success"
                                                    : "message-author text-primary"
                                            }
                                        >
                                            {message.senderid === user.id
                                                ? user.name
                                                : friend.name}
                                        </p>
                                    </Link>
                                    <p className="message-time">
                                        {formatDateTime(message.createdat)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollToBottom>
            <form onSubmit={handleSendMessage}>
                <input
                    className="send-message"
                    type="text"
                    value={messageInput}
                    placeholder="Write a message..."
                    onChange={event => setMessageInput(event.target.value)}
                    required
                />
            </form>
        </div>
    );
}
