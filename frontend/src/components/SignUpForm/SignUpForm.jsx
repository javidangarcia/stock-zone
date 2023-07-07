import "./SignUpForm.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUpForm({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const userData = {
                username,
                password,
                email
            };

            const response = await axios.post(
                "http://localhost:3000/users/signup",
                userData,
                { withCredentials: true }
            );

            setUsername("");
            setPassword("");
            setEmail("");

            const user = response.data.user;
            setUser(user);

            alert("Sign Up Successful.");
        } catch (error) {
            alert("Username or email already exists.");
        }
    }

    return (
        <div className="signup-form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                <button type="submit">Sign Up</button>
                <p className="log-in-redirect">
                    Already have an account?{" "}
                    <Link to="/login" className="link">
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
}
