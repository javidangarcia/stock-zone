export const fetchStocks = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/stocks`, {
        credentials: "include",
    });

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchStockComments = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/comments`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const sendStockComments = async (stock, content) => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/comments`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        }
    );

    if (response.status === 400) throw new Error("Please fill out all fields.");

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
