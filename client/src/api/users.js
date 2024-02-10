export const fetchStocksFollowedByUser = async user => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${user.username}/following`,
        {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
