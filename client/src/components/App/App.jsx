import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Navigation from "../Navigation/Navigation";
import Home from "../Home/Home";
import Search from "../Search/Search";
import StockData from "../StockData/StockData";
import Ranking from "../Ranking/Ranking";
import UserProfile from "../UserProfile/UserProfile";
import Loading from "../Loading/Loading";
import ChatRoom from "../ChatRoom/ChatRoom";
import Discussions from "../Discussions/Discussions";
import PostView from "../PostView/PostView";
import { ToastContainer } from "react-toastify";

export default function App() {
    const user = useSelector(state => state.user);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const requireAuth = element => (user != null ? element : <Login />);

    const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    return (
        <div className="app">
            <BrowserRouter>
                {user != null ? <Navigation /> : null}
                <Loading />
                <ToastContainer {...toastOptions} />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={requireAuth(<Home />)} />
                    <Route path="/home" element={requireAuth(<Home />)} />
                    <Route path="/search" element={requireAuth(<Search />)} />
                    <Route path="/ranking" element={requireAuth(<Ranking />)} />
                    <Route
                        path="/discussions"
                        element={requireAuth(<Discussions />)}
                    />
                    <Route
                        path="/discussions/:postID"
                        element={requireAuth(<PostView />)}
                    />
                    <Route
                        path="/search/stocks/:ticker"
                        element={requireAuth(<StockData />)}
                    />
                    <Route
                        path="/profile"
                        element={requireAuth(<UserProfile />)}
                    />
                    <Route
                        path="/profile/:username"
                        element={requireAuth(<UserProfile />)}
                    />
                    <Route path="/chat" element={requireAuth(<ChatRoom />)} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
