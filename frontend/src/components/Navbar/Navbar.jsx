import "./Navbar.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App/App";
import { useContext } from "react";

export default function Navbar() {
    const { user, setError } = useContext(UserContext);

    async function handleLogout() {
        try {
            await axios.post("http://localhost:3000/users/logout", {
                withCredentials: true
            });
            localStorage.clear();

        } catch (error) {
            setError(`${error.message}: Please try again later.`);
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
