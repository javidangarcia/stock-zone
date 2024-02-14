import { getTwoWeeksAgoDate, getCurrentDate } from "../utils.js";

export const fetchStockNews = async stock => {
    const newsUrl = new URL("https://finnhub.io/api/v1/company-news");
    newsUrl.searchParams.append("symbol", stock.ticker);
    newsUrl.searchParams.append("from", getTwoWeeksAgoDate());
    newsUrl.searchParams.append("to", getCurrentDate());
    newsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);

    const response = await fetch(newsUrl);

    if (response.status === 429)
        throw new Error("API limit reached for stock news.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
