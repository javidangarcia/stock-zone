import "./LoginForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const userData = {
                username,
                password
            };

            await axios.post("http://localhost:3000/users/login", userData);

            navigate("/");

        } catch (error) {
            alert("Invalid username or password.")
        }
    }

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Log In</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <p>
                    New to the app? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}
