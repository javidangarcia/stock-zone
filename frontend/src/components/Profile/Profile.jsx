import "./Profile.css";
import { useContext } from "react";
import { UserContext } from "../App/App";

export default function Profile() {
    const { user } = useContext(UserContext);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-picture">
                    <img src={user.picture} alt={`This is a profile picture associated with ${user.username}`} />
                </div>
                <div className="profile-details">
                    <h1>{user.fullName}</h1>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
                <div className="profile-stocks">
                    <p>Stocks You Follow</p>
                    <p>Stocks You Like</p>
                    <p>Stocks You Dislike</p>
                </div>
            </div>
        </div>
    )
}