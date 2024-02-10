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

export const fetchStockFollowers = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/followers`,
        {
            credentials: "include",
        }
    );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchStockLikers = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/likers`,
        {
            credentials: "include",
        }
    );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchStockDislikers = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/dislikers`,
        {
            credentials: "include",
        }
    );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
