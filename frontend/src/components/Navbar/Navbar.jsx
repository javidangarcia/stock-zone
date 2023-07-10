import "./Navbar.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
    async function handleLogout() {
        try {
            await axios.post("http://localhost:3000/users/logout", {
                withCredentials: true
            });
            localStorage.clear();
        } catch (error) {}
    }

    return (
        <nav className="navbar">
            <div className="nav-pages">
                <Link to="/home">Stock Zone</Link>
                <Link to="/home">Home</Link>
                <Link to="/search">Search</Link>
            </div>
            <div className="nav-profile">
                {user ? (
                    <div className="logout">
                        <p>{user.username}</p>
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
