export const fetchOneYearData = async stock => {
    const priceUrl = new URL("https://api.twelvedata.com/time_series");
    priceUrl.searchParams.append("symbol", stock);
    priceUrl.searchParams.append("interval", "1month");
    priceUrl.searchParams.append("outputsize", 13);
    priceUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

    const response = await fetch(priceUrl);

    const data = await response.json();

    if (data.code === 429)
        throw new Error("API limit reached for stock chart.");

    if (data.status === "error")
        throw new Error("Oops! Something went wrong on our end.");

    return data;
};

export const fetchOneMonthData = async stock => {
    const priceUrl = new URL("https://api.twelvedata.com/time_series");
    priceUrl.searchParams.append("symbol", stock);
    priceUrl.searchParams.append("interval", "1day");
    priceUrl.searchParams.append("outputsize", 21);
    priceUrl.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

    const response = await fetch(priceUrl);
    console.log(response);

    const data = await response.json();

    if (data.code === 429)
        throw new Error("API limit reached for stock chart.");

    if (data.status === "error")
        throw new Error("Oops! Something went wrong on our end.");

    return data;
};
