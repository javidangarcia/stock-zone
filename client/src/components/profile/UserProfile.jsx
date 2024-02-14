import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch } from "react-redux";
import UserActivity from "./UserActivity";
import Friendship from "./Friendship";
import { setLoading } from "../../redux/loading";
import { fetchUserProfile } from "../../api/users";
import { toast } from "react-toastify";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        fetchUserProfile(username)
            .then(data => {
                setProfile(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => dispatch(setLoading(false)));
    }, [username]);

    return Object.keys(profile).length > 0 ? (
        <div className="d-flex justify-content-center align-items-center flex-column">
            <div className="position-relative mt-5">
                <Card>
                    <div className="position-relative">
                        <Card.Img variant="top" src={profile.picture} />
                        <Friendship profile={profile} />
                    </div>
                    <Card.Body className="text-center">
                        <Card.Title className="m-0">{profile.name}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush text-center">
                        <ListGroup.Item>
                            Username: {profile.username}
                        </ListGroup.Item>
                        <ListGroup.Item>Email: {profile.email}</ListGroup.Item>
                    </ListGroup>
                </Card>
            </div>
            <UserActivity username={username} />
        </div>
    ) : null;
}
