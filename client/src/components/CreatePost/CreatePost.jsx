import "./CreatePost.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { setLoading } from "../../redux/loading";
import { createPosts } from "../../api/posts";
import { toast } from "react-toastify";

export default function CreatePost({ posts, setPosts }) {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const createPost = () => {
        dispatch(setLoading(true));
        createPosts(title, content)
            .then(data => {
                const { id, ...userData } = user;
                setPosts([...posts, { ...data, ...userData }]);
                setShowCreatePost(false);
                setTitle("");
                setContent("");
                toast.success("Successfully created a post!", {
                    toastId: "success",
                });
            })
            .catch(error => toast.error(error.message, { toastId: "error" }))
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <div className="d-flex justify-content-center">
            <Button
                className="create-post-button mt-3 mb-3"
                variant="primary"
                onClick={() => setShowCreatePost(true)}
            >
                Create Post
            </Button>

            <Modal
                show={showCreatePost}
                onHide={() => setShowCreatePost(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            placeholder="Title"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            aria-label="With textarea"
                            value={content}
                            onChange={event => setContent(event.target.value)}
                            style={{ height: "200px" }}
                            placeholder="Content"
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreatePost(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={createPost}
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
