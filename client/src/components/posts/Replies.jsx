import "./Replies.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setLoading } from "../../redux/loading";
import { formatDateTime, compareCommentsByDate } from "../../utils";
import CreateReply from "./CreateReply";
import { fetchPostReplies } from "../../api/posts";
import { toast } from "react-toastify";

export default function Replies({ postId }) {
    const [replies, setReplies] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchPostReplies(postId)
            .then(data => {
                setReplies(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return (
        <div>
            <CreateReply
                postId={postId}
                replies={replies}
                setReplies={setReplies}
            />
            {replies.sort(compareCommentsByDate).map(reply => (
                <div className="reply-details mt-3" key={reply.id}>
                    <div className="reply-picture">
                        <img
                            src={reply.picture}
                            alt={`This is the profile associated with ${reply.username}`}
                        />
                    </div>
                    <div className="reply-content">
                        <Link
                            to={`/profile/${reply.username}`}
                            className="user-link"
                        >
                            <p className="reply-name">{reply.name}</p>
                        </Link>
                        <p className="reply-date">
                            {formatDateTime(reply.createdat)}
                        </p>
                        <p className="reply-content">{reply.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
