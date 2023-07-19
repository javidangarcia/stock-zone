import "./Search.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchTable from "../SearchTable/SearchTable";
import SearchQuery from "../SearchQuery/SearchQuery";

export default function Search() {
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        navigate(`stocks/${searchInput}`);
    };

    return (
        <div className="search">
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
                <SearchQuery searchInput={searchInput} />
            </div>
            <SearchTable />
        </div>
    );
}
