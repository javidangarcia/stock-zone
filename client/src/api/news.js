import { getTwoWeeksAgoDate, getCurrentDate } from "../utils.js";

export const fetchStockNews = async stock => {
    let newsUrl = "";

    if (stock) {
        newsUrl = new URL("https://finnhub.io/api/v1/company-news");
        newsUrl.searchParams.append("symbol", stock.ticker);
        newsUrl.searchParams.append("from", getTwoWeeksAgoDate());
        newsUrl.searchParams.append("to", getCurrentDate());
        newsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    } else {
        newsUrl = new URL("https://finnhub.io/api/v1/news");
        newsUrl.searchParams.append("category", "forex");
        newsUrl.searchParams.append("minId", "10");
        newsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    }

    const response = await fetch(newsUrl);

    if (response.status === 429) throw new Error("API limit reached.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
