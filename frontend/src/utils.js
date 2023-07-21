// Functions

export const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
};

export const capitalize = (sentence) => {

    const words = sentence.split(" ");

    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(" ");
};

export const firstWord = (string) => {
    return string.split(" ")[0];
};

export const isValidStock = (stock) => {
    return (
        stock.currency === "USD" &&
        stock.instrument_type === "Common Stock" &&
        (stock.exchange === "NYSE" || stock.exchange === "NASDAQ")
    );
};

export const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };
    return dateTime.toLocaleDateString("en-US", options);
};

export const compareCommentsByDate = (firstDate, secondDate) => {
    return new Date(secondDate.createdAt) - new Date(firstDate.createdAt);
  };

// URLs

export function getStockOverviewUrl(ticker) {
    const stockOverviewUrl = new URL(
        "https://www.alphavantage.co/query/?function=OVERVIEW"
    );
    stockOverviewUrl.searchParams.append("symbol", ticker);
    stockOverviewUrl.searchParams.append("apikey", import.meta.env.VITE_ALPHA);
    return stockOverviewUrl.href;
}

export function getStockPriceUrl(ticker) {
    const stockPriceUrl = new URL("https://finnhub.io/api/v1/quote");
    stockPriceUrl.searchParams.append("symbol", ticker);
    stockPriceUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockPriceUrl.href;
}

export function getStockLogoUrl(ticker) {
    const stockLogoUrl = new URL("https://finnhub.io/api/v1/stock/profile2");
    stockLogoUrl.searchParams.append("symbol", ticker);
    stockLogoUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockLogoUrl.href;
}
