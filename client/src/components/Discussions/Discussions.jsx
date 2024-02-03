import "./Discussions.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "../CreatePost/CreatePost";
import { setLoading } from "../../redux/loading";
import {
    NetworkError,
    ServerError,
    comparePostsByDate,
    formatDateTime
} from "../../utils";

export default function Discussions() {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/posts`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setPosts(response.data.posts);
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
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/discussions/${postId}`);
    };

    return !loading ? (
        <Container>
            <Row>
                <Col>
                    <CreatePost setPosts={setPosts} />
                </Col>
            </Row>
            {posts.sort(comparePostsByDate).map((post) => (
                <Row key={post.id} className="mb-3">
                    <Col>
                        <Card
                            className="post-card"
                            onClick={() => handlePostClick(post.id)}
                        >
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center">
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
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            ))}
        </Container>
    ) : null;
}
