import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import { setLoading } from "../../redux/loading";
import { comparePostsByDate, formatDateTime } from "../../utils";
import { fetchPosts } from "../../api/posts";
import { toast } from "react-toastify";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchPosts()
            .then(data => {
                setPosts(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <CreatePost posts={posts} setPosts={setPosts} />
                </Col>
            </Row>
            {posts.sort(comparePostsByDate).map(post => (
                <Row key={post.id} className="mb-3">
                    <Col>
                        <Card
                            className="post-card mx-auto"
                            style={{ maxWidth: "60%", cursor: "pointer" }}
                            onClick={() => navigate(`/posts/${post.id}`)}
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
                                        to={`/profile/${post.username}`}
                                    >
                                        {post.username}
                                    </Link>{" "}
                                </small>
                                <small className="text-muted">
                                    {formatDateTime(post.createdat)}
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            ))}
        </Container>
    );
}
