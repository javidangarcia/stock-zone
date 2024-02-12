export const fetchMessages = async friendId => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/messages/${friendId}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const sendMessage = async (friendId, room, content) => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/messages/${friendId}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ room, content }),
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (!response.ok) throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
