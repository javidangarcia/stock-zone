import "./SearchQuery.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { isValidStock } from "../../utils";
import { UserContext } from "../App/App";
import { Link } from "react-router-dom";

export default function SearchQuery({ searchInput }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { setErrorMessage } = useContext(UserContext);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchInput !== "") {
                try {
                    const stockSearchUrl = new URL("https://api.twelvedata.com/symbol_search");
                    stockSearchUrl.searchParams.append("symbol", searchInput);
                    stockSearchUrl.searchParams.append("outputsize", 5);
                    stockSearchUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);
                    const response = await axios.get(stockSearchUrl, { validateStatus: () => true });
                    
                    if (response.data.status === "ok") {
                        setSearchResults(response.data.data);
                        setShowDropdown(true);
                    }
        
                    if (response.data.status === "error") {
                        setErrorMessage(`${response.code}: ${response.message}`);
                    }
                } catch (error) {
                    setErrorMessage(`${error.message}: Please try again later.`);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }
        fetchSearchResults();
    }, [searchInput]);

    return (
        showDropdown ? (
            <div className="search-dropdown">
                {
                    searchResults?.map((stock) => {
                        if (isValidStock(stock)) {
                            return (
                                <Link key={`${stock.instrument_name}-${stock.symbol}`} 
                                    to={`/search/stocks/${stock.symbol}`} 
                                    className="stock-link"
                                >
                                    <div className="search-dropdown-item">
                                        <p>{stock.instrument_name} ({stock.symbol})</p>
                                    </div>
                                </Link>
                            )
                        }
                    })
                }
            </div>
        ) : (
            null
        )
    )
}