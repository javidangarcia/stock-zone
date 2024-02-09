export const fetchStocks = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/stocks`, {
        credentials: "include",
    });

    if (response.status === 404)
        throw new Error("There are no stocks in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
