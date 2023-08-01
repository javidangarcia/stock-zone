import "./Navigation.css";
import axios from "axios";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { Context } from "../../context";
import appLogo from "../../assets/stock-zone.png";

export default function Navigation() {
    const { user, setUser, setErrorMessage } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/users/logout`,
                null,
                { withCredentials: true }
            );

            if (response.status === 200) {
                localStorage.clear();
                setUser(null);
                navigate("/login");
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    };

    return (
        <Navbar className="py-2 navbar">
            <Container>
                <Navbar.Brand
                    className="d-flex align-items-center fs-3 text-white me-3 h1 mb-0"
                    as={Link}
                    to="/home"
                >
                    <Image
                        src={appLogo}
                        alt="This is the logo of Stock Zone."
                        className="app-logo me-2"
                    />
                    Stock Zone
                </Navbar.Brand>
                <Nav className="me-auto">
                    <NavLink
                        className="fs-5 text-white nav-link mx-2"
                        activeclassname="active"
                        as={Link}
                        to="/home"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        className="fs-5 text-white nav-link mx-2"
                        activeclassname="active"
                        as={Link}
                        to="/search"
                    >
                        Search
                    </NavLink>
                    <NavLink
                        className="fs-5 text-white nav-link mx-2"
                        activeclassname="active"
                        as={Link}
                        to="/ranking"
                    >
                        Ranking
                    </NavLink>
                </Nav>
                <Dropdown>
                    <Dropdown.Toggle variant="link" bsPrefix="none">
                        <Image
                            src={user.picture}
                            alt="Profile Picture"
                            roundedCircle
                            className="navbar-profile"
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            as={Link}
                            to={`/profile/${user.username}`}
                        >
                            Your Profile
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/chat">
                            Messages
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}
