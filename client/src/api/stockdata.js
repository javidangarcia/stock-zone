import { capitalize } from "../utils";

const fetchStockPrice = async stock => {
    const priceUrl = new URL("https://finnhub.io/api/v1/quote");
    priceUrl.searchParams.append("symbol", stock);
    priceUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);

    const response = await fetch(priceUrl);

    if (response.status === 429)
        throw new Error("API limit reached for stock price.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

const fetchStockOverview = async stock => {
    const overviewUrl = new URL(
        "https://www.alphavantage.co/query/?function=OVERVIEW"
    );
    overviewUrl.searchParams.append("symbol", stock);
    overviewUrl.searchParams.append("apikey", import.meta.env.VITE_ALPHA);

    const response = await fetch(overviewUrl);

    if (response.status === 429)
        throw new Error("API limit reached for stock overview.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

const fetchStockLogo = async stock => {
    const logoUrl = new URL("https://finnhub.io/api/v1/stock/profile2");
    logoUrl.searchParams.append("symbol", stock);
    logoUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);

    const response = await fetch(logoUrl);

    if (response.status === 429)
        throw new Error("API limit reached for stock logo.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

const storeStockData = async stockData => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/stocks`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData),
    });

    if (response.status === 409)
        throw new Error("This stock already exists in the database.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchStockData = async stock => {
    const stockPrice = await fetchStockPrice(stock);

    if (stockPrice.c === 0) throw new Error("This stock ticker is not valid.");

    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 409) {
        const overview = await fetchStockOverview(stock);
        const logo = await fetchStockLogo(stock);

        const newStockData = {
            ticker: overview.Symbol.toUpperCase(),
            name: overview.Name,
            description: overview.Description,
            sector: capitalize(overview.Sector),
            price: stockPrice.c,
            logo: logo.logo,
        };

        return await storeStockData(newStockData);
    }

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    const data = await response.json();

    return { ...data, price: stockPrice.c };
};
