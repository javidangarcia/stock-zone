import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import Follow from "../Follow/Follow";
import Like from "../Like/Like";
import Dislike from "../Dislike/Dislike";
import Comments from "../Comments/Comments";
import {
    getStockOverviewUrl,
    getStockPriceUrl,
    getStockLogoUrl,
    capitalize
} from "../../utils";
import StockChart from "../StockChart/StockChart";
import { setLoading } from "../../redux/loading";

export default function StockData() {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState({});
    const [stockNotFound, setStockNotFound] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                dispatch(setLoading(true));
                setStockNotFound(false);

                const databaseResponse = await axios.get(
                    `${import.meta.env.VITE_HOST}/stocks/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (databaseResponse.status === 200) {
                    setStockData(databaseResponse.data.stock);
                    dispatch(setLoading(false));
                    return;
                }

                if (databaseResponse.status === 500) {
                }

                const stockOverviewUrl = getStockOverviewUrl(ticker);
                const stockPriceUrl = getStockPriceUrl(ticker);
                const stockLogoUrl = getStockLogoUrl(ticker);

                const [overviewResponse, priceResponse, logoResponse] =
                    await Promise.all([
                        axios.get(stockOverviewUrl),
                        axios.get(stockPriceUrl),
                        axios.get(stockLogoUrl)
                    ]);

                const overviewData = overviewResponse.data;
                const priceData = priceResponse.data;
                const logoData = logoResponse.data;
                dispatch(setLoading(false));

                if (Object.keys(overviewData).length === 0) {
                    setStockNotFound(true);
                    return;
                }

                if (overviewData.Note != null) {
                    return;
                }

                const stockSector = capitalize(overviewData.Sector);

                const combinedStockData = {
                    ticker: overviewData.Symbol,
                    name: overviewData.Name,
                    description: overviewData.Description,
                    sector: stockSector,
                    price: priceData.c,
                    logo: logoData.logo
                };

                setStockData(combinedStockData);

                // POST stock data to database for later use
                const response = axios.post(
                    `${import.meta.env.VITE_HOST}/stocks`,
                    combinedStockData,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 404) {
                }

                if (response.status === 500) {
                }
            } catch (error) {
                dispatch(setLoading(false));
                setStockNotFound(true);
            }
        };
        fetchStockData();
    }, []);

    return (
        <div className="stock-data">
            {stockNotFound ? (
                <p
                    className="alert alert-danger d-flex justify-content-center"
                    role="alert"
                >
                    This stock does not exist.
                </p>
            ) : null}

            {!stockNotFound && stockData.name ? (
                <div className="container-fluid vh-100 p-0">
                    <div className="row h-100">
                        <div className="col-md-6 h-100">
                            <p className="h2 m-5 mb-2">
                                {stockData.name} ({stockData.ticker})
                            </p>
                            <div className="d-flex align-items-center ms-5 mb-2">
                                <p className="h2 text-primary me-2 mb-0">
                                    ${stockData.price?.toFixed(2)}
                                </p>
                                <Follow
                                    ticker={ticker}
                                    stockData={stockData}
                                    setStockData={setStockData}
                                />
                                <Like
                                    ticker={ticker}
                                    stockData={stockData}
                                    setStockData={setStockData}
                                />
                                <Dislike
                                    ticker={ticker}
                                    stockData={stockData}
                                    setStockData={setStockData}
                                />
                            </div>
                            <p className="ms-5 me-5 mb-2">
                                {stockData.description}
                            </p>
                            <p className="ms-5 me-5 mb-3">
                                Sector: {stockData.sector}
                            </p>
                            <StockChart ticker={ticker} />
                            <Comments ticker={ticker} />
                        </div>

                        <div className="col-md-6 d-flex align-items-center justify-content-end h-100">
                            <Image
                                src={stockData.logo}
                                alt={`This is a logo of ${stockData.name}.`}
                                className="img-fluid h-100"
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
