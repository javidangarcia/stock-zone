export const fetchSearchMatches = async searchQuery => {
    const url = new URL("https://api.twelvedata.com/symbol_search");
    url.searchParams.append("symbol", searchQuery);
    url.searchParams.append("outputsize", 15);
    url.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    if (data.code === 429)
        throw new Error("API limit reached for stock search.");

    if (data.status === "error")
        throw new Error("Oops! Something went wrong on our end.");

    return data;
};
