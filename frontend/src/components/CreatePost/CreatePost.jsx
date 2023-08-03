import "./CreatePost.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import { NetworkError, ServerError } from "../../utils";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function CreatePost({ setPosts }) {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const dispatch = useDispatch();

    async function createPost(event) {
        event.preventDefault();

        if (!title || !content) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please make sure to fill in both the title and content fields before creating a post."
            });
            return;
        }

        try {
            dispatch(setLoading(true));
            const postData = {
                title,
                content
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/post`,
                postData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Successfully Created a Post!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setPosts((prevPosts) => [...prevPosts, response.data.post]);
                setTitle("");
                setContent("");
                setShowCreatePost(false);
            }

            if (response.status === 500) {
                ServerError();
            }

            dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false));
            NetworkError(error);
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <Button
                className="create-post-button mt-3 mb-3"
                variant="primary"
                onClick={() => setShowCreatePost(true)}
            >
                Create Post
            </Button>

            <Modal show={showCreatePost} onHide={() => setShowCreatePost(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Title"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            aria-label="With textarea"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
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
