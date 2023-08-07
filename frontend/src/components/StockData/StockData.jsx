import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Swal from "sweetalert2";
import Follow from "../Follow/Follow";
import Like from "../Like/Like";
import Dislike from "../Dislike/Dislike";
import Comments from "../Comments/Comments";
import {
    getStockOverviewUrl,
    getStockPriceUrl,
    getStockLogoUrl,
    capitalize,
    NetworkError,
    ServerError,
    ResponseError
} from "../../utils";
import StockChart from "../StockChart/StockChart";
import { setLoading } from "../../redux/loading";

export default function StockData() {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState({});
    const dispatch = useDispatch();
    const [hasRendered, setHasRendered] = useState(false);
    const [category, setCategory] = useState("chart");
    const [stockInDatabase, setStockInDatabase] = useState(false);
    const navigate = useNavigate();
    const [stockPrice, setStockPrice] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                dispatch(setLoading(true));

                const stockPriceResponse = await axios.get(
                    getStockPriceUrl(ticker)
                );

                if (stockPriceResponse.data.c === 0) {
                    dispatch(setLoading(false));
                    Swal.fire({
                        icon: "error",
                        title: "Stock Not Found",
                        text: "The stock ticker you entered does not correspond to any existing company."
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/search");
                        }
                    });
                    return;
                }

                setStockPrice(stockPriceResponse.data.c);

                const databaseResponse = await axios.get(
                    `${import.meta.env.VITE_HOST}/stock/${ticker}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (databaseResponse.status === 200) {
                    setStockData(databaseResponse.data.stock);
                    setStockInDatabase(true);
                    dispatch(setLoading(false));
                    return;
                }

                if (databaseResponse.status === 500) {
                    ServerError();
                }

                const stockOverviewUrl = getStockOverviewUrl(ticker);
                const stockLogoUrl = getStockLogoUrl(ticker);

                const [overviewResponse, logoResponse] = await Promise.all([
                    axios.get(stockOverviewUrl),
                    axios.get(stockLogoUrl)
                ]);

                const overviewData = overviewResponse.data;
                const logoData = logoResponse.data;

                if (overviewData.Note != null) {
                    dispatch(setLoading(false));
                    Swal.fire({
                        icon: "error",
                        title: "API Limit Reached",
                        text: `${overviewData.Note}`
                    });
                    return;
                }

                const stockSector = capitalize(overviewData.Sector);

                const combinedStockData = {
                    ticker: overviewData.Symbol.toUpperCase(),
                    name: overviewData.Name,
                    description: overviewData.Description,
                    sector: stockSector,
                    price: stockPriceResponse.data.c,
                    logo: logoData.logo
                };

                setStockData(combinedStockData);

                const response = await axios.post(
                    `${import.meta.env.VITE_HOST}/stock`,
                    combinedStockData,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStockInDatabase(true);
                }

                if (response.status === 409) {
                    ResponseError(response.data.error);
                }

                if (response.status === 500) {
                    ServerError();
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError(error);
            }
        };

        if (hasRendered) {
            fetchStockData();
        } else {
            setHasRendered(true);
        }
    }, [hasRendered]);

    return (
        <div className="stock-data">
            {stockInDatabase ? (
                <div className="container-fluid vh-100 p-0">
                    <div className="row h-100">
                        <div className="col-md-6 h-100">
                            <p className="h2 m-5 mb-2">
                                {stockData.name} ({stockData.ticker})
                            </p>
                            <div className="d-flex align-items-center ms-5 mb-2">
                                <p className="h2 text-primary me-2 mb-0">
                                    ${stockPrice?.toFixed(2)}
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
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={category}
                                onSelect={(k) => setCategory(k)}
                                className="mb-3 me-5 ms-5"
                                fill
                                justify
                            >
                                <Tab
                                    eventKey="chart"
                                    title={
                                        <span
                                            className={
                                                category === "chart"
                                                    ? "text-primary"
                                                    : "text-dark"
                                            }
                                        >
                                            Chart
                                        </span>
                                    }
                                >
                                    <StockChart ticker={ticker} />
                                </Tab>
                                <Tab
                                    eventKey="comments"
                                    title={
                                        <span
                                            className={
                                                category === "comments"
                                                    ? "text-primary"
                                                    : "text-dark"
                                            }
                                        >
                                            Comments
                                        </span>
                                    }
                                >
                                    <Comments ticker={ticker} />
                                </Tab>
                            </Tabs>
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
