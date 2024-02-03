import "./Profile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch } from "react-redux";
import ProfileHistory from "../ProfileHistory/ProfileHistory";
import FriendConnection from "../FriendConnection/FriendConnection";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError, ResponseError } from "../../utils";

export default function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/user/${username}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setProfile(response.data.user);
                }

                if (response.status === 404) {
                    ResponseError(response.data.error);
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
        fetchProfile();
    }, [username]);

    return profile.username ? (
        <div className="d-flex justify-content-center align-items-center flex-column">
            <div className="profile-card mt-5">
                <Card>
                    <div className="profile-header">
                        <Card.Img variant="top" src={profile.picture} />
                        <FriendConnection
                            username={username}
                            profile={profile}
                            setProfile={setProfile}
                        />
                    </div>
                    <Card.Body className="text-center">
                        <Card.Title className="m-0">
                            {profile.fullName}
                        </Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush text-center">
                        <ListGroup.Item>
                            Username: {profile.username}
                        </ListGroup.Item>
                        <ListGroup.Item>Email: {profile.email}</ListGroup.Item>
                    </ListGroup>
                </Card>
            </div>
            <ProfileHistory username={username} />
        </div>
    ) : null;
}
