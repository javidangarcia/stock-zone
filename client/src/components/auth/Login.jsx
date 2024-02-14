import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import appLogo from "../../assets/stock-zone.png";
import { setUser } from "../../redux/user";
import { setLoading } from "../../redux/loading";
import { signIn } from "../../api/auth";
import { toast } from "react-toastify";

export default function Login() {
    const [userCredentials, setUserCredentials] = useState({
        username: "",
        password: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async event => {
        event.preventDefault();

        dispatch(setLoading(true));
        signIn(userCredentials)
            .then(data => {
                dispatch(setUser(data));
                navigate("/");
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

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
                        style={{ height: "50px", width: "50px" }}
                    />
                    Stock Zone
                </div>
                <h2 className="mb-4 text-center fs-5">Login to your account</h2>
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
                                    value={userCredentials.username}
                                    onChange={e =>
                                        setUserCredentials({
                                            ...userCredentials,
                                            username: e.target.value,
                                        })
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
                                    value={userCredentials.password}
                                    onChange={e =>
                                        setUserCredentials({
                                            ...userCredentials,
                                            password: e.target.value,
                                        })
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
                    <Link className="text-decoration-none" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
