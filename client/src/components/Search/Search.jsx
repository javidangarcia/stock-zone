import "./Search.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StockCarousel from "../StockCarousel/StockCarousel";
import SearchQuery from "../SearchQuery/SearchQuery";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async event => {
        event.preventDefault();
        navigate(`stocks/${searchQuery}`);
    };

    return (
        <div>
            <div className="search-container">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for a Stock..."
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                    />
                    <button type="submit">
                        <i className="fa fa-search" />
                    </button>
                </form>
                <SearchQuery searchQuery={searchQuery} />
            </div>
            <StockCarousel />
        </div>
    );
}
