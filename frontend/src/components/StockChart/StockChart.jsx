import { useState, useEffect, useContext } from "react";
import ApexCharts from "react-apexcharts";
import { formatDateToMonth } from "../../utils";
import axios from "axios";
import { UserContext } from "../App/App";

export default function StockChart({ ticker }) {
    const { setErrorMessage } = useContext(UserContext);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchPriceData = async () => {
            try {
                const priceUrl = new URL(
                    "https://api.twelvedata.com/time_series"
                );
                priceUrl.searchParams.append("symbol", ticker);
                priceUrl.searchParams.append("interval", "1month");
                priceUrl.searchParams.append("outputsize", "12");
                priceUrl.searchParams.append(
                    "apikey",
                    import.meta.env.VITE_TWELVE
                );

                const response = await axios.get(priceUrl, {
                    validateStatus: () => true
                });

                if (response.status === 200) {
                    const dates = response.data.values
                        ?.map((interval) =>
                            formatDateToMonth(interval.datetime)
                        )
                        .slice()
                        .reverse();

                    const prices = response.data.values
                        ?.map((interval) =>
                            parseFloat(interval.close).toFixed(2)
                        )
                        .slice()
                        .reverse();

                    const newChartData = {
                        options: {
                            xaxis: {
                                categories: dates,
                                labels: {
                                    rotate: 0
                                }
                            },
                            tooltip: {
                                y: {
                                    formatter: function (val) {
                                        return "$" + val;
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                name: "Stock Price",
                                data: prices
                            }
                        ]
                    };

                    setChartData(newChartData);
                } else {
                    setErrorMessage(`${response.error}`);
                }
            } catch (error) {
                setErrorMessage(`System Error: ${error.message}`);
            }
        };
        fetchPriceData();
    }, []);

    return (
        <div className="me-5 ms-5">
            {chartData?.options && chartData?.series ? (
                <ApexCharts
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    height={400}
                />
            ) : null}
        </div>
    );
}
