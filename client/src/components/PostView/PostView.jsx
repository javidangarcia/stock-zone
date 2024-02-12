import "./PostView.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useParams, Link } from "react-router-dom";
import PostComments from "../PostComments/PostComments";
import { formatDateTime } from "../../utils";
import { setLoading } from "../../redux/loading";
import { fetchPostsById } from "../../api/posts";
import { toast } from "react-toastify";

export default function PostView() {
    const [post, setPost] = useState({});
    const { postId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchPostsById(postId)
            .then(data => {
                setPost(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return Object.keys(post).length > 0 ? (
        <div>
            <Card className="post-view-card mt-5">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Posted by{" "}
                        <Link
                            className="user-link text-primary"
                            to={`/profile/${post.username}`}
                        >
                            {post.username}
                        </Link>{" "}
                    </small>
                    <small className="text-muted">
                        {formatDateTime(post.createdat)}
                    </small>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <PostComments postId={postId} />
                </Card.Body>
            </Card>
        </div>
    ) : null;
}
