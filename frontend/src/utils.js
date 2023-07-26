// Functions

export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

export const capitalize = (sentence) => {
    const words = sentence.split(" ");

    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(" ");
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

export const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-CA");
};

export const formatDateToMonth = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedDate = new Intl.DateTimeFormat("en", {
        month: "short"
    }).format(dateObject);

    return formattedDate;
};

export const formatDateToMonthDay = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedMonth = new Intl.DateTimeFormat("en", {
        month: "short"
    }).format(dateObject);

    const formattedDay = new Intl.DateTimeFormat("en", {
        day: "numeric"
    }).format(dateObject);

    return `${formattedMonth} ${formattedDay}`;
};

export const getCurrentTime = () => {
    return new Date().getTime();
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

export function getMarketNewsUrl() {
    const marketNewsUrl = new URL("https://finnhub.io/api/v1/news");
    marketNewsUrl.searchParams.append("category", "forex");
    marketNewsUrl.searchParams.append("minId", "10");
    marketNewsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return marketNewsUrl.href;
}

export function getStockNewsUrl(currentStock) {
    const stockNewsUrl = new URL("https://finnhub.io/api/v1/company-news");
    stockNewsUrl.searchParams.append("symbol", currentStock);
    stockNewsUrl.searchParams.append("from", "2023-07-01");
    stockNewsUrl.searchParams.append("to", getCurrentDate());
    stockNewsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockNewsUrl.href;
}
