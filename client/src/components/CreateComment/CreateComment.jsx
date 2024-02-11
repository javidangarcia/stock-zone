import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import { setLoading } from "../../redux/loading";
import { createReplies } from "../../api/posts";
import { toast } from "react-toastify";

export default function CreateComment({ postId, replies, setReplies }) {
    const [showCreateReply, setShowCreateReply] = useState(false);
    const [replyInput, setReplyInput] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const createReply = () => {
        dispatch(setLoading(true));
        createReplies(postId, replyInput)
            .then(data => {
                const { id, ...userData } = user;
                setReplies([...replies, { ...data, ...userData }]);
                setShowCreateReply(false);
                setReplyInput("");
                toast.success("Successfully replied to this post!", {
                    toastId: "success",
                });
            })
            .catch(error => toast.error(error.message, { toastId: "error" }))
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <div>
            <Button
                className="w-100"
                variant="primary"
                onClick={() => setShowCreateReply(true)}
            >
                Leave a Reply
            </Button>
            <Modal
                show={showCreateReply}
                onHide={() => setShowCreateReply(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Write a Reply</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            aria-label="With textarea"
                            value={replyInput}
                            onChange={event =>
                                setReplyInput(event.target.value)
                            }
                            style={{ height: "200px" }}
                            placeholder="Write a Reply..."
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreateReply(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={createReply}
                    >
                        Reply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
