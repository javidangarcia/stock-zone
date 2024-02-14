import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Navbar from "./navbar/Navbar";
import Home from "./home/Home";
import Search from "./search/Search";
import StockData from "./stocks/StockData";
import Ranking from "./Ranking";
import UserProfile from "./profile/UserProfile";
import Loading from "./Loading";
import ChatRooms from "./chat/ChatRooms";
import Posts from "./posts/Posts";
import PostDetails from "./posts/PostDetails";
import { ToastContainer } from "react-toastify";

export default function App() {
    const user = useSelector(state => state.user);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const requireAuth = element => (user ? element : <Login />);

    const toastOptions = {
        position: "top-right",
        autoClose: 1500,
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
                <Loading />
                <ToastContainer {...toastOptions} />
                {user ? <Navbar /> : null}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={requireAuth(<Home />)} />
                    <Route path="/home" element={requireAuth(<Home />)} />
                    <Route path="/search" element={requireAuth(<Search />)} />
                    <Route path="/ranking" element={requireAuth(<Ranking />)} />
                    <Route path="/posts" element={requireAuth(<Posts />)} />
                    <Route
                        path="/posts/:postId"
                        element={requireAuth(<PostDetails />)}
                    />
                    <Route
                        path="/search/stocks/:ticker"
                        element={requireAuth(<StockData />)}
                    />
                    <Route
                        path="/profile/:username"
                        element={requireAuth(<UserProfile />)}
                    />
                    <Route path="/chat" element={requireAuth(<ChatRooms />)} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
