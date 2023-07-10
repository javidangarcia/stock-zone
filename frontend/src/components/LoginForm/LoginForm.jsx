import "./LoginForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        setError("");

        try {
            const userData = {
                username,
                password
            };

            const response = await axios.post(
                "http://localhost:3000/users/login",
                userData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                const user = response.data.user;

                setUser(user);

                navigate("/");
            }

            if (response.status === 401) {
                setError(response.data.error);
            }
        } catch (error) {
            setError(`${error.message}: Please try again later.`);
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
                <p className="sign-up-redirect">
                    New to Stock Zone?{" "}
                    <Link to="/signup" className="link">
                        Sign Up
                    </Link>
                </p>
            </form>
            {
                error &&
                <div className="error">
                    <p>{error}</p>
                </div>
            }
        </div>
    );
}
