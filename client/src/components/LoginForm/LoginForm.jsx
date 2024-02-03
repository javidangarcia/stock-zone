import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import appLogo from "../../assets/stock-zone.png";
import { setUser } from "../../redux/user";
import { setLoading } from "../../redux/loading";
import { NetworkError, ResponseError, ServerError } from "../../utils";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        try {
            dispatch(setLoading(true));
            const userData = {
                username,
                password
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/users/login`,
                userData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                const user = response.data?.user;

                dispatch(setUser(user));

                navigate("/");
            }

            if (response.status === 401) {
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
                <h2 className="mb-4 text-center fs-5">
                    Log in to your account
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="row mb-3">
                        <div className="col">
                            <label
                                htmlFor="username"
                                className="form-label w-100"
                            >
                                Username
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label
                                htmlFor="password"
                                className="form-label w-100"
                            >
                                Password
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button
                                type="submit"
                                className="btn btn-primary col-12"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
                <p className="mt-3 text-center">
                    Don&apos;t have an account?{" "}
                    <Link className="text-decoration-none" to="/signup">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
