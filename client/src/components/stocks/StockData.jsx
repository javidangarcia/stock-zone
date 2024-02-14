import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import StockComments from "./StockComments";
import StockChart from "./StockChart";
import { setLoading } from "../../redux/loading";
import { fetchStockData } from "../../api/stockdata";
import { toast } from "react-toastify";
import Actions from "./actions/Actions";

export default function StockData() {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState({});
    const dispatch = useDispatch();
    const [category, setCategory] = useState("chart");

    useEffect(() => {
        dispatch(setLoading(true));
        fetchStockData(ticker)
            .then(data => {
                setStockData(data);
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return Object.keys(stockData).length > 0 ? (
        <div className="stock-data">
            <div className="container-fluid vh-100 p-0">
                <div className="row h-100">
                    <div className="col-md-6 h-100">
                        <p className="h2 m-5 mb-2">
                            {stockData.name} ({stockData.ticker})
                        </p>
                        <div className="d-flex align-items-center ms-5 mb-2">
                            <p className="h2 text-primary me-2 mb-0">
                                ${stockData.price.toFixed(2)}
                            </p>
                            <Actions ticker={ticker} />
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
                            onSelect={k => setCategory(k)}
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
                                <StockComments ticker={ticker} />
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
        </div>
    ) : null;
}
