import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setLoading } from "../../redux/loading";
import { formatDateTime, compareCommentsByDate } from "../../utils";
import CreateComment from "../CreateComment/CreateComment";
import { fetchPostReplies } from "../../api/posts";

export default function PostComments({ postId }) {
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
            <CreateComment
                postId={postId}
                replies={replies}
                setReplies={setReplies}
            />
            {replies.sort(compareCommentsByDate).map(reply => (
                <div className="comment-details mt-3" key={reply.id}>
                    <div className="comment-picture">
                        <img
                            src={reply.picture}
                            alt={`This is the profile associated with ${reply.username}`}
                        />
                    </div>
                    <div className="comment-content">
                        <Link
                            to={`/profile/${reply.username}`}
                            className="user-link"
                        >
                            <p className="comment-name">{reply.name}</p>
                        </Link>
                        <p className="comment-date">
                            {formatDateTime(reply.createdat)}
                        </p>
                        <p className="comment-content">{reply.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
