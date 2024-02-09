import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import appLogo from "../../assets/stock-zone.png";
import { setUser } from "../../redux/user";
import { setLoading } from "../../redux/loading";
import { registerUser } from "../../api/auth";
import { toast } from "react-toastify";

export default function Register() {
    const [registerBody, setRegisterBody] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async event => {
        event.preventDefault();

        toast.dismiss();

        dispatch(setLoading(true));
        registerUser(registerBody)
            .then(data => {
                dispatch(setUser(data));
                navigate("/");
            })
            .catch(error => {
                toast.error(error.message);
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
                <h2 className="mb-4 text-center fs-5">Create an account</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label w-100">
                            Name
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={registerBody.name}
                                onChange={e =>
                                    setRegisterBody({
                                        ...registerBody,
                                        name: e.target.value,
                                    })
                                }
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
                                value={registerBody.email}
                                onChange={e =>
                                    setRegisterBody({
                                        ...registerBody,
                                        email: e.target.value,
                                    })
                                }
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
                                value={registerBody.username}
                                onChange={e =>
                                    setRegisterBody({
                                        ...registerBody,
                                        username: e.target.value,
                                    })
                                }
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
                                value={registerBody.password}
                                onChange={e =>
                                    setRegisterBody({
                                        ...registerBody,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary col-12">
                        Register
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link className="text-decoration-none" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
