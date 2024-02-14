export const fetchUserProfile = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

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

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 404) throw new Error("This user does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchFriends = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/friends`,
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

export const addFriend = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}/friend`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 409)
        throw new Error("You are already friends with this user.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const removeFriend = async username => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/${username}/unfriend`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 401)
        throw new Error(
            "Session has expired. Please sign out and sign back in."
        );

    if (response.status === 409)
        throw new Error("You are not friends with this user.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
