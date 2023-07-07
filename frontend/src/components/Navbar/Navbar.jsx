import "./Navbar.css";
import axios from "axios";

export default function Navbar({ user }) {
    async function handleLogout() {
        try {
            await axios.post("http://localhost:3000/users/logout", {
                withCredentials: true
            });
            localStorage.clear();
        } catch (error) {
            console.log(error);
        }
    }

    function handleLogin() {
        window.location.href = "/login";
    }

    return (
        <nav className="navbar">
            <div className="nav-pages">
                <a href="/home">Stock Zone</a>
                <a href="/home">Home</a>
                <a href="/search">Search</a>
            </div>
            <div className="nav-profile">
                {!user && (
                    <button onClick={handleLogin} className="log-in">
                        Log In
                    </button>
                )}
                <p>{user && user.username}</p>
                {user && (
                    <a href="" onClick={handleLogout}>
                        (Logout)
                    </a>
                )}
            </div>
        </nav>
    );
}
