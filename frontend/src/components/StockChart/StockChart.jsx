import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { formatDateToMonth, formatDateToMonthDay } from "../../utils";

export default function StockChart({ ticker }) {
    const [chartData, setChartData] = useState({});
    const [oneYearData, setOneYearData] = useState([]);
    const [oneMonthData, setOneMonthData] = useState([]);

    const createDaysChart = (historicalData) => {
        const dates = historicalData
            ?.map((interval) => formatDateToMonthDay(interval.datetime))
            .slice()
            .reverse();

        const prices = historicalData
            ?.map((interval) => parseFloat(interval.close).toFixed(2))
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
                        formatter(val) {
                            return `$${val}`;
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
    };

    const createMonthsChart = (historicalData) => {
        const dates = historicalData
            ?.map((interval) => formatDateToMonth(interval.datetime))
            .slice()
            .reverse();

        const prices = historicalData
            ?.map((interval) => parseFloat(interval.close).toFixed(2))
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
                        formatter(val) {
                            return `$${val}`;
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
    };

    useEffect(() => {
        const fetchOneYearData = async () => {
            try {
                const priceUrl = new URL(
                    "https://api.twelvedata.com/time_series"
                );
                priceUrl.searchParams.append("symbol", ticker);
                priceUrl.searchParams.append("interval", "1month");
                priceUrl.searchParams.append("outputsize", 12);
                priceUrl.searchParams.append(
                    "apikey",
                    import.meta.env.VITE_TWELVE
                );

                const response = await axios.get(priceUrl, {
                    validateStatus: () => true
                });

                if (response.data.status === "ok") {
                    createMonthsChart(response.data.values);
                    setOneYearData(response.data.values);
                }

                if (response.data.status === "error") {
                }
            } catch (error) {}
        };
        fetchOneYearData();
    }, []);

    async function fiveDays() {
        if (oneMonthData.length > 0) {
            const fiveDaysData = [...oneMonthData].slice(0, 5);
            createDaysChart(fiveDaysData);
            return;
        }

        try {
            const priceUrl = new URL("https://api.twelvedata.com/time_series");
            priceUrl.searchParams.append("symbol", ticker);
            priceUrl.searchParams.append("interval", "1day");
            priceUrl.searchParams.append("outputsize", 21);
            priceUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

            const response = await axios.get(priceUrl, {
                validateStatus: () => true
            });

            if (response.data.status === "ok") {
                setOneMonthData(response.data.values);
                createDaysChart(response.data.values);
            }

            if (response.data.status === "error") {
            }
        } catch (error) {}
    }

    async function oneMonth() {
        if (oneMonthData.length > 0) {
            setChartData([...oneMonthData]);
        }
        try {
            const priceUrl = new URL("https://api.twelvedata.com/time_series");
            priceUrl.searchParams.append("symbol", ticker);
            priceUrl.searchParams.append("interval", "1day");
            priceUrl.searchParams.append("outputsize", 21);
            priceUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

            const response = await axios.get(priceUrl, {
                validateStatus: () => true
            });

            if (response.data.status === "ok") {
                setOneMonthData(response.data.values);
                createDaysChart(response.data.values);
            }

            if (response.data.status === "error") {
            }
        } catch (error) {}
    }

    function sixMonths() {
        const sixMonthsData = [...oneYearData].slice(0, 6);
        createMonthsChart(sixMonthsData);
    }

    function oneYear() {
        createMonthsChart([...oneYearData]);
    }

    return (
        <div className="me-5 ms-5">
            <ToggleButtonGroup
                className="d-flex justify-content-center"
                type="radio"
                name="options"
                defaultValue={4}
            >
                <ToggleButton
                    id="tbg-radio-2"
                    value={1}
                    onClick={() => fiveDays()}
                >
                    5D
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-3"
                    value={2}
                    onClick={() => oneMonth()}
                >
                    1M
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-4"
                    value={3}
                    onClick={() => sixMonths()}
                >
                    6M
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-5"
                    value={4}
                    onClick={() => oneYear()}
                >
                    1Y
                </ToggleButton>
            </ToggleButtonGroup>
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
