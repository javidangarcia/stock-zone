import "./Navigation.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import appLogo from "../../assets/stock-zone.png";
import { clearUser } from "../../redux/user";
import { toast } from "react-toastify";
import { signOut } from "../../api/auth";

export default function Navigation() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleLogout = () => {
        signOut()
            .then(() => {
                localStorage.clear();
                dispatch(clearUser());
                navigate("/login");
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
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
                    <NavLink
                        className="fs-5 text-white nav-link mx-2"
                        activeclassname="active"
                        as={Link}
                        to="/discussions"
                    >
                        Discussions
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
