import "./Search.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App/App";
import { isValidStock } from "../../utils";

export default function Search() {
    const { setError } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [stocks, setStocks] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get("http://localhost:3000/stocks");

                if (response.status === 200) {
                    setStocks(response.data.stocks);
                }

                if (response.status === 404) {
                    setError(response.data.error);
                }

                if (response.status === 500) {
                    setError(`${response.statusText}: Please try again later.`);
                }
            } catch (error) {
                setError(`${error.message}: Please try again later.`);
            }
        }
        fetchStocks();
    }, []);

    const handleSearchChange = async (event) => {
        const userInput = event.target.value;
        setSearchInput(userInput);

        if (userInput !== "") {
            try {
                const stockSearchUrl = new URL("https://api.twelvedata.com/symbol_search");
                stockSearchUrl.searchParams.append("symbol", userInput);
                stockSearchUrl.searchParams.append("outputsize", 5);
                stockSearchUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);
                const response = await axios.get(stockSearchUrl, { validateStatus: () => true });

                if (response.data.status === "ok") {
                    setSearchResults(response.data.data);
                    setShowDropdown(true);
                }
    
                if (response.data.status === "error") {
                    setError(`${response.code}: ${response.message}`);
                }
            } catch (error) {
                setError(`${error.message}: Please try again later.`);
            }
        } else {
            setSearchInput([]);
            setShowDropdown(false);
        }
    }

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
                        onChange={handleSearchChange}
                    />
                    <button type="submit">
                        <i className="material-icons">search</i>
                    </button>
                </form>
                {
                    showDropdown && 
                    <div className="dropdown">
                        {
                            searchResults.map((stock) => {
                                if (isValidStock(stock)) {
                                    return (
                                        <Link key={stock.instrument_name} to={`/search/stocks/${stock.symbol}`} className="stock-link">
                                            <div className="dropdown-item">
                                                <p>{stock.instrument_name} ({stock.symbol})</p>
                                            </div>
                                        </Link>
                                    )
                                }
                            })
                        }
                    </div>
                }
            </div>
            <table className="search-table">
                <tbody>
                    <tr>
                        <th>Logo</th>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Sector</th>
                        <th>Price</th>
                    </tr>
                </tbody>
                {
                    stocks?.map((stock) => {
                        return (
                            <tbody key={stock.name}>
                                <tr>
                                    <td id="stock-logo">
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                    </td>
                                    <td id="stock-ticker">
                                        <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                            {stock.ticker}
                                        </Link>
                                    </td>
                                    <td>{stock.name}</td>
                                    <td>{stock.sector}</td>
                                    <td>${stock.price?.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        </div>
    );
}
