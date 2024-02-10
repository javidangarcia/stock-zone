import "./Comments.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDateTime, compareCommentsByDate } from "../../utils";
import { toast } from "react-toastify";
import { fetchStockComments, sendStockComments } from "../../api/stocks";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loading";

export default function Comments({ ticker }) {
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        fetchStockComments(ticker)
            .then(data => {
                setComments(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
    }, []);

    const handleSendComments = async event => {
        event.preventDefault();
        dispatch(setLoading(true));
        sendStockComments(ticker, commentInput)
            .then(data => {
                setCommentInput("");
                const { id, ...userData } = user;
                setComments([...comments, { ...data, ...userData }]);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <div className="comments me-5 ms-5 mb-5">
            <h2>Comments</h2>
            <div className="past-comments">
                {comments.sort(compareCommentsByDate).map(comment => (
                    <div className="comment-details" key={comment.id}>
                        <div className="comment-picture">
                            <img
                                src={comment.picture}
                                alt={`This is the profile associated with ${comment.username}`}
                            />
                        </div>
                        <div className="comment-content">
                            <Link
                                to={`/profile/${comment.username}`}
                                className="user-link"
                            >
                                <p className="comment-name">{comment.name}</p>
                            </Link>
                            <p className="comment-date">
                                {formatDateTime(comment.createdat)}
                            </p>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form className="form-comments" onSubmit={handleSendComments}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={event => setCommentInput(event.target.value)}
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
