import "./SearchQuery.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isValidStock } from "../../utils";
import { fetchSearchMatches } from "../../api/search";
import { toast } from "react-toastify";

export default function SearchQuery({ searchQuery }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchMatches, setSearchMatches] = useState([]);

    useEffect(() => {
        if (!searchQuery) {
            setShowDropdown(false);
            return;
        }

        fetchSearchMatches(searchQuery)
            .then(data => {
                setSearchMatches(data.data);
                setShowDropdown(true);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            });
    }, [searchQuery]);

    return showDropdown ? (
        <div className="search-dropdown">
            {searchMatches.map(stock => {
                if (isValidStock(stock)) {
                    return (
                        <Link
                            key={`${stock.instrument_name}-${stock.symbol}`}
                            to={`/search/stocks/${stock.symbol}`}
                            className="stock-link"
                        >
                            <div className="search-dropdown-item">
                                <p>
                                    {stock.instrument_name} ({stock.symbol})
                                </p>
                            </div>
                        </Link>
                    );
                }
                return null;
            })}
        </div>
    ) : null;
}
