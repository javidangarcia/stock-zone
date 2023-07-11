import "./App.css";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Search from "../Search/Search";
import StockData from "../StockData/StockData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "../SignUpForm/SignUpForm";
import LoginForm from "../LoginForm/LoginForm";
import { useState, useEffect, createContext } from "react";
import Error from "../Error/Error";

export const UserContext = createContext();

export default function App() {
    const [error, setError] = useState("");
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <div className="app">
            <UserContext.Provider value={{ user, setUser, setError }}>
                <BrowserRouter>
                    <Error error={error} />
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/home" element={<Home />}></Route>
                        <Route path="/search" element={<Search />}></Route>
                        <Route
                            path="/search/stocks/:ticker"
                            element={<StockData />}
                        ></Route>
                        <Route
                            path="/login"
                            element={<LoginForm />}
                        ></Route>
                        <Route
                            path="/signup"
                            element={<SignUpForm />}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}
