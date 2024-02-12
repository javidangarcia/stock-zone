import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { formatDateToMonth, formatDateToMonthDay } from "../../utils";
import { fetchOneMonthData, fetchOneYearData } from "../../api/chart";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";

export default function StockChart({ ticker }) {
    const [chart, setChart] = useState({});
    const [oneYearData, setOneYearData] = useState([]);
    const [oneMonthData, setOneMonthData] = useState([]);
    const dispatch = useDispatch();

    const createChart = (historicalData, chartType) => {
        const dates = historicalData
            .map(interval => {
                if (chartType === "days") {
                    return formatDateToMonthDay(interval.datetime);
                } else {
                    return formatDateToMonth(interval.datetime);
                }
            })
            .slice()
            .reverse();

        const prices = historicalData
            .map(interval => Number.parseFloat(interval.close).toFixed(2))
            .slice()
            .reverse();

        const newChart = {
            options: {
                xaxis: {
                    categories: dates,
                    labels: {
                        rotate: 0,
                    },
                },
                tooltip: {
                    y: {
                        formatter(val) {
                            return `$${val}`;
                        },
                    },
                },
            },
            series: [
                {
                    name: "Stock Price",
                    data: prices,
                },
            ],
        };

        setChart(newChart);
    };

    const handleFiveDays = () => {
        const fiveDaysData = [...oneMonthData].slice(0, 5);
        createChart(fiveDaysData, "days");
    };

    const handleOneMonth = () => {
        createChart([...oneMonthData], "days");
    };

    const handleSixMonths = () => {
        if (oneYearData.length > 0) {
            const sixMonthsData = [...oneYearData].slice(0, 6);
            createChart(sixMonthsData, "months");
            return;
        }

        dispatch(setLoading(true));
        fetchOneYearData(ticker)
            .then(data => {
                setOneYearData([...data.values]);
                const sixMonthsData = data.values.slice(0, 6);
                createChart(sixMonthsData, "months");
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const handleOneYear = () => {
        if (oneYearData.length > 0) {
            createChart([...oneYearData], "months");
            return;
        }

        dispatch(setLoading(true));
        fetchOneYearData(ticker)
            .then(data => {
                setOneYearData([...data.values]);
                createChart(data.values, "months");
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    useEffect(() => {
        dispatch(setLoading(true));
        fetchOneMonthData(ticker)
            .then(data => {
                setOneMonthData([...data.values]);
                const fiveDaysData = data.values.slice(0, 5);
                createChart(fiveDaysData, "days");
            })
            .catch(error => {
                toast.error(error.message, { toastId: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    return (
        <div className="me-5 ms-5">
            <ToggleButtonGroup
                className="d-flex justify-content-center"
                type="radio"
                name="options"
                defaultValue={1}
            >
                <ToggleButton
                    id="tbg-radio-2"
                    value={1}
                    onClick={handleFiveDays}
                >
                    5D
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-3"
                    value={2}
                    onClick={handleOneMonth}
                >
                    1M
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-4"
                    value={3}
                    onClick={handleSixMonths}
                >
                    6M
                </ToggleButton>
                <ToggleButton
                    id="tbg-radio-5"
                    value={4}
                    onClick={handleOneYear}
                >
                    1Y
                </ToggleButton>
            </ToggleButtonGroup>
            {Object.keys(chart).length > 0 && (
                <ApexCharts
                    options={chart.options}
                    series={chart.series}
                    type="line"
                    height={400}
                />
            )}
        </div>
    );
}
