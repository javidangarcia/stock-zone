export const followStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/follow`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You already follow this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const unfollowStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/unfollow`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You are not currently following this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const likeStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/like`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You already like this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const unlikeStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/unlike`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You are not currently liking this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const dislikeStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/dislike`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You already dislike this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const undislikeStock = async stock => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/stocks/${stock}/undislike`,
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

    if (response.status === 404)
        throw new Error("This stock does not exist in the database.");

    if (response.status === 409)
        throw new Error("You are not currently disliking this stock.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
