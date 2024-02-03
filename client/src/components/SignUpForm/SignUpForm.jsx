import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import {
    capitalize,
    NetworkError,
    ServerError,
    ResponseError
} from "../../utils";
import appLogo from "../../assets/stock-zone.png";
import { setUser } from "../../redux/user";
import { setLoading } from "../../redux/loading";

export default function SignUpForm() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            dispatch(setLoading(true));
            const userData = {
                fullName: capitalize(fullName),
                username,
                password,
                email
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/users/signup`,
                userData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                setFullName("");
                setUsername("");
                setPassword("");
                setEmail("");

                const user = response.data?.user;
                dispatch(setUser(user));

                navigate("/");
            }

            if (response.status === 409 || response.status === 400) {
                ResponseError(response.data.error);
            }

            if (response.status === 500) {
                ServerError();
            }

            dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false));
            NetworkError(error);
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
                <h2 className="mb-4 text-center fs-5">Create an account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label w-100">
                            Full Name
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label w-100">
                            Email
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label w-100">
                            Username
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label w-100">
                            Password
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary col-12">
                        Sign Up
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link className="text-decoration-none" to="/login">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
