import "./Navbar.css";

export default function Navbar({ user }) {
    return (
        <nav className="navbar">
            <a href="/home">Stock Zone</a>
            <a href="/home">Home</a>
            <a href="/search">Search</a>
            <a href="/login">Log In</a>
            <a href="/signup">Sign Up</a>
            <a href="">{user && user.username}</a>
        </nav>
    );
}
