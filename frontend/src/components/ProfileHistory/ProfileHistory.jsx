import "./ProfileHistory.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App/App";
import { Link } from "react-router-dom";

export default function ProfileHistory({ username }) {
    const [followsHistory, setFollowsHistory] = useState([]);
    const [likesHistory, setLikesHistory] = useState([]);
    const [dislikesHistory, setDislikesHistory] = useState([]);
    const { setErrorMessage } = useContext(UserContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [followsResponse, likesResponse, dislikesResponse] =
                    await Promise.all([
                        axios.get(`http://localhost:3000/follows/${username}`, { withCredentials: true, validateStatus: () => true }),
                        axios.get(`http://localhost:3000/likes/${username}`, { withCredentials: true, validateStatus: () => true }),
                        axios.get(`http://localhost:3000/dislikes/${username}`, { withCredentials: true, validateStatus: () => true })
                    ]);

                if (followsResponse.status === 200) {
                    setFollowsHistory(followsResponse.data.stocksYouFollow);
                    setLikesHistory(likesResponse.data.stocksYouLike);
                    setDislikesHistory(dislikesResponse.data.stocksYouDislike);
                }
    
                if (followsResponse.status === 500) {
                    setErrorMessage(`${response.statusText}: Please try again later.`);
                }
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchHistory();
    }, [username]);

    return (
        <div className="profile-history">
            <div className="follows-history">
                <p>Stocks You Follow</p>
                {
                    followsHistory?.map((stock) => {
                        return (
                            <div key={stock.ticker} className="stock-margin">
                                <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                    <div className="stock">
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                        <p>{stock.ticker}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
            <div className="likes-history">
                <p>Stocks You Like</p>
                {
                    likesHistory?.map((stock) => {
                        return (
                            <div key={stock.ticker} className="stock-margin">
                                <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                    <div className="stock">
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                        <p>{stock.ticker}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
            <div className="dislikes-history">
                <p>Stocks You Dislike</p>
                {
                    dislikesHistory?.map((stock) => {
                        return (
                            <div key={stock.ticker} className="stock-margin">
                                <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                    <div className="stock">
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                        <p>{stock.ticker}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}