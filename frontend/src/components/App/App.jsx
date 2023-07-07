import "./App.css";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Search from "../Search/Search";
import StockData from "../StockData/StockData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "../SignUpForm/SignUpForm";
import LoginForm from "../LoginForm/LoginForm";
import { useState, useEffect } from "react";

export default function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <div className="app">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home user={user} />}></Route>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/search" element={<Search />}></Route>
                    <Route
                        path="/search/stocks/:ticker"
                        element={<StockData />}
                    ></Route>
                    <Route
                        path="/login"
                        element={<LoginForm setUser={setUser} />}
                    ></Route>
                    <Route path="/signup" element={<SignUpForm />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
