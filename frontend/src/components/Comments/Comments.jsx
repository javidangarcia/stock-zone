import "./Comments.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    formatDateTime,
    compareCommentsByDate,
    NetworkError,
    ServerError,
    ResponseError
} from "../../utils";

export default function Comments({ ticker }) {
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_HOST}/comments/${ticker}`,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setComments(response.data.comments);
            }

            if (response.status === 404) {
                ResponseError(response.data.error);
            }

            if (response.status === 500) {
                ServerError();
            }
        } catch (error) {
            NetworkError(error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const commentData = {
                ticker,
                content: commentInput
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/comments`,
                commentData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                const newComments = [...comments, response.data.comment];
                setComments(newComments);
                setCommentInput("");
            }

            if (response.status === 404) {
                ResponseError(response);
            }

            if (response.status === 500) {
                ServerError();
            }
        } catch (error) {
            NetworkError(error);
        }
    };

    return (
        <div className="comments me-5 ms-5 mb-5">
            <h2>Comments</h2>
            <div className="past-comments">
                {comments?.sort(compareCommentsByDate).map((comment) => (
                    <div className="comment-details" key={comment.id}>
                        <div className="comment-picture">
                            <img
                                src={comment.User.picture}
                                alt={`This is the profile associated with ${comment.User.username}`}
                            />
                        </div>
                        <div className="comment-content">
                            <Link
                                to={`/profile/${comment.User.username}`}
                                className="user-link"
                            >
                                <p className="comment-name">
                                    {comment.User.fullName}
                                </p>
                            </Link>
                            <p className="comment-date">
                                {formatDateTime(comment.createdAt)}
                            </p>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form className="form-comments" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(event) => setCommentInput(event.target.value)}
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
