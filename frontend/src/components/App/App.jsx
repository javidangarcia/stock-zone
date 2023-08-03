import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import Home from "../Home/Home";
import Search from "../Search/Search";
import StockData from "../StockData/StockData";
import SignUpForm from "../SignUpForm/SignUpForm";
import LoginForm from "../LoginForm/LoginForm";
import Ranking from "../Ranking/Ranking";
import Profile from "../Profile/Profile";
import Loading from "../Loading/Loading";
import ChatRoom from "../ChatRoom/ChatRoom";
import Discussions from "../Discussions/Discussions";
import PostView from "../PostView/PostView";

export default function App() {
    const user = useSelector((state) => state.user);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const requireAuth = (element) => (user != null ? element : <LoginForm />);

    return (
        <div className="app">
            <BrowserRouter>
                {user != null ? <Navigation /> : null}
                <Loading />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignUpForm />} />

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
                    <Route path="/profile" element={requireAuth(<Profile />)} />
                    <Route
                        path="/profile/:username"
                        element={requireAuth(<Profile />)}
                    />
                    <Route path="/chat" element={requireAuth(<ChatRoom />)} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
