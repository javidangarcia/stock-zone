import { NetworkError } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { setLoading } from "../../redux/loading";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";

export default function CreateComment({ postID, comments, setComments }) {
    const [showCreateComment, setShowCreateComment] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (commentInput === "") {
            Swal.fire({
                icon: "error",
                title: "Missing Field",
                text: "Please make sure to fill in the content field before creating a comment."
            });
            return;
        }

        try {
            dispatch(setLoading(true));
            const commentData = {
                content: commentInput
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/post/comment/${postID}`,
                commentData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Successfully Created a Comment!",
                    showConfirmButton: false,
                    timer: 1500
                });
                const newComments = [...comments, response.data.comment];
                setComments(newComments);
                setCommentInput("");
                setShowCreateComment(false);
            }

            if (response.status === 404) {
                ResponseError(response);
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

    return (
        <div>
            <Button
                className="w-100"
                variant="primary"
                onClick={() => setShowCreateComment(true)}
            >
                Leave a Comment
            </Button>
            <Modal
                show={showCreateComment}
                onHide={() => setShowCreateComment(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Write a Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            aria-label="With textarea"
                            value={commentInput}
                            onChange={(event) =>
                                setCommentInput(event.target.value)
                            }
                            style={{ height: "200px" }}
                            placeholder="Write a Comment..."
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreateComment(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
