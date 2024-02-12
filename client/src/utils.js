import { format } from "date-fns";

export const capitalize = string => {
    return string
        .split(" ")
        .map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ");
};

export const formatDate = timestamp => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

export const isValidStock = stock =>
    stock.currency === "USD" &&
    stock.instrument_type === "Common Stock" &&
    (stock.exchange === "NYSE" || stock.exchange === "NASDAQ");

export const formatDateTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);

    return format(dateTime, "MMMM do, yyyy 'at' h:mm aa");
};

export const compareCommentsByDate = (firstDate, secondDate) =>
    new Date(secondDate.createdat) - new Date(firstDate.createdat);

export const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-CA");
};

export const formatDateToMonth = inputDate => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedDate = new Intl.DateTimeFormat("en", {
        month: "short",
    }).format(dateObject);

    return formattedDate;
};

export const formatDateToMonthDay = inputDate => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedMonth = new Intl.DateTimeFormat("en", {
        month: "short",
    }).format(dateObject);

    const formattedDay = new Intl.DateTimeFormat("en", {
        day: "numeric",
    }).format(dateObject);

    return `${formattedMonth} ${formattedDay}`;
};

export const getCurrentTime = () => new Date().getTime();

export function getTwoWeeksAgoDate() {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const year = twoWeeksAgo.getFullYear();
    const month = String(twoWeeksAgo.getMonth() + 1).padStart(2, "0");
    const day = String(twoWeeksAgo.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function isValidArticle(currentStock, article) {
    return (
        article.image !== "" &&
        article.summary.length < 1000 &&
        (article.headline.includes(currentStock.ticker) ||
            article.summary.includes(currentStock.ticker) ||
            article.headline.includes(currentStock.name) ||
            article.summary.includes(currentStock.name))
    );
}

export const comparePostsByDate = (firstDate, secondDate) =>
    new Date(secondDate.createdat) - new Date(firstDate.createdat);
