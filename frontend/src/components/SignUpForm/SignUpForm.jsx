import "./SignUpForm.css";
import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App/App";

export default function SignUpForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const { setUser, setError } = useContext(UserContext);

    const navigate = useNavigate();

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
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setUsername("");
                setPassword("");
                setEmail("");

                const user = response.data.user;
                setUser(user);

                setSuccess(true);

                setTimeout(() => {
                    setSuccess(false);
                    navigate("/");
                }, 1000);
            }

            if (response.status === 409 || response.status === 400) {
                setError(response.data.error);
            }
        } catch (error) {
            setError(`${error.message}: Please try again later.`);
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
            {success && (
                <div className="success">
                    <p>Account successfully created.</p>
                </div>
            )}
        </div>
    );
}
