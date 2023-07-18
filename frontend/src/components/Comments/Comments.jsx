import "./Comments.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App/App";
import { formatDateTime, capitalize } from "../../utils";

export default function Comments({ ticker }) {
    const { setError } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/comments/${ticker}`,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setComments(response.data.comments);
            }

            if (response.status === 404) {
                setError(response.data.error);
            }

            if (response.status === 500) {
                setError(`${response.statusText}: Please try again later.`);
            }
        } catch (error) {
            setError(`${error.message}: Please try again later.`);
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
                "http://localhost:3000/comments",
                commentData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                fetchComments();
                setCommentInput("");
            }

            if (response.status === 404) {
                setError(response.data.error);
            }

            if (response.status === 500) {
                setError(`${response.statusText}: Please try again later.`);
            }
        } catch (error) {
            setError(`${error.message}: Please try again later.`);
        }
    };

    return (
        <div className="comments">
            <h2>Comments</h2>
            <div className="past-comments">
                {comments?.map((comment) => {
                    return (
                        <div className="comment-details" key={comment.content}>
                            <p className="comment-name">{capitalize(comment.User.username)}</p>
                            <p className="comment-date">{formatDateTime(comment.createdAt)}</p>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    );
                })}
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
