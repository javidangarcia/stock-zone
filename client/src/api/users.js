export const fetchUserProfile = async username => {
    console.log(username);
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchFollowedStocks = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}/following`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchLikedStocks = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}/liked`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchDislikedStocks = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}/disliked`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
