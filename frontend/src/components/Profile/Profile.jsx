import "./Profile.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App/App";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileHistory from "../ProfileHistory/ProfileHistory";

export default function Profile() {
    const { username } = useParams();
    const { setErrorMessage } = useContext(UserContext);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/user/${username}`, 
                    { validateStatus: () => true }
                );

                if (response.status === 200) {
                    setProfile(response.data.user);
                }

                if (response.status === 404) {
                    setErrorMessage(response.data.error);
                }

                if (response.status === 500) {
                    setErrorMessage(`${response.statusText}: Please try again later.`);
                }
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchProfile();
    }, [username]);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-picture">
                    <img src={profile.picture} alt={`This is a profile picture associated with ${profile.username}`} />
                </div>
                <div className="profile-details">
                    <h1>{profile.fullName}</h1>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                </div>
                <ProfileHistory username={username} />
            </div>
        </div>
    )
}