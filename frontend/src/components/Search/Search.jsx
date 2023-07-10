import "./Search.css";
import StockData from "../StockData/StockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Search(props) {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    function handleSearchSubmit(event) {
        event.preventDefault();
        navigate(`stocks/${searchInput}`);
    }

    return (
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search for a Stock..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                />
                <button type="submit">
                    <i className="material-icons">search</i>
                </button>
            </form>
        </div>
    );
}
