export const fetchSearchMatches = async searchQuery => {
    const url = new URL("https://api.twelvedata.com/symbol_search");
    url.searchParams.append("symbol", searchQuery);
    url.searchParams.append("outputsize", 5);
    url.searchParams.append("apikey", import.meta.env.VITE_TWELVE);

    const response = await fetch(url);

    if (response.status === 429) throw new Error("API limit reached.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
