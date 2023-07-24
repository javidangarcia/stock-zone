import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App/App";
import Image from "react-bootstrap/Image";
import appLogo from "../../assets/stock-zone.png";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, setErrorMessage } = useContext(UserContext);

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

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
                const user = response.data?.user;

                setUser(user);

                navigate("/");
            }

            if (response.status === 401) {
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    }

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="col-md-6 col-sm-8 col-lg-4">
                <div className="d-flex justify-content-center align-items-center mb-3 h2 me-2">
                    <Image
                        src={appLogo}
                        alt="This is the logo of Stock Zone."
                        className="app-logo me-2 d-flex justify-content-center"
                    />
                    Stock Zone
                </div>
                <h2 className="mb-4 text-center fs-5">
                    Log in to your account
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary col-12">
                        Login
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account?{" "}
                    <Link className="text-decoration-none" to="/signup">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
