import "./App.css";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Search from "../Search/Search";
import StockData from "../StockData/StockData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "../SignUpForm/SignUpForm";
import LoginForm from "../LoginForm/LoginForm";

export default function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/search" element={<Search />}></Route>
                    <Route
                        path="/search/stocks/:ticker"
                        element={<StockData />}
                    ></Route>
                    <Route path="/login" element={<LoginForm />}></Route>
                    <Route path="/signup" element={<SignUpForm />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
