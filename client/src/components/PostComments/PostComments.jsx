import { useDispatch } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { setLoading } from "../../redux/loading";
import {
    NetworkError,
    ServerError,
    formatDateTime,
    compareCommentsByDate
} from "../../utils";
import CreateComment from "../CreateComment/CreateComment";

export default function PostComments({ postID }) {
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/post/comments/${postID}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setComments(response.data.comments);
                }

                if (response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `${response.data.error}`
                    });
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
        fetchComments();
    }, []);

    return (
        <div>
            <CreateComment
                postID={postID}
                comments={comments}
                setComments={setComments}
            />
            {comments?.sort(compareCommentsByDate).map((comment) => (
                <div className="comment-details mt-3" key={comment.id}>
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
    );
}
