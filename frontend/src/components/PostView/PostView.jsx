import "./PostView.css";
import { useParams } from "react-router";
import { NetworkError, formatDateTime } from "../../utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { setLoading } from "../../redux/loading";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import PostComments from "../PostComments/PostComments";

export default function PostView() {
    const [post, setPost] = useState({});
    const { postID } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/post/${postID}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setPost(response.data.post);
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

        fetchPost();
    }, []);

    return Object.keys(post).length > 0 ? (
        <div>
            <Card className="post-view-card mt-5">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Posted by{" "}
                        <Link
                            className="user-link text-primary"
                            to={`/profile/${post.User.username}`}
                        >
                            {post.User.username}
                        </Link>{" "}
                    </small>
                    <small className="text-muted">
                        {formatDateTime(post.createdAt)}
                    </small>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <PostComments postID={postID} />
                </Card.Body>
            </Card>
        </div>
    ) : null;
}
