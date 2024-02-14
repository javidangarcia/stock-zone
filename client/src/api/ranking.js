export const fetchRanking = async page => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/ranking/${page}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
