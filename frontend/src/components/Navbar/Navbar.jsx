import "./Navbar.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App/App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, setUser, setErrorMessage } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogout(event) {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/users/logout",
                null,
                {
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                localStorage.clear();
                setUser(null);
                navigate("/login");
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    }

    return (
        <nav className="navbar">
            <div className="nav-pages">
                <Link to="/home">Stock Zone</Link>
                <Link to="/home">Home</Link>
                <Link to="/search">Search</Link>
                <Link to="/ranking">Ranking</Link>
            </div>
            <div className="nav-profile">
                {user ? (
                    <div className="logout">
                        <Link to={`/profile/${user.username}`}>
                            <div className="user-info">
                                <img
                                    src={user.picture}
                                    alt={`This is a profile picture associated with ${user.username}`}
                                />
                                <p>{user.username}</p>
                            </div>
                        </Link>
                        <a href="" onClick={handleLogout}>
                            (Logout)
                        </a>
                    </div>
                ) : (
                    <Link to="/login" className="login">
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
}
