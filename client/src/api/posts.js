export const fetchPosts = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/posts`, {
        credentials: "include",
    });

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const createPosts = async (title, content) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.status === 400) throw new Error("Please fill out all fields.");

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchPostsById = async postId => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/posts/${postId}`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This post does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const fetchPostReplies = async postId => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/posts/${postId}/replies`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 404) throw new Error("This post does not exist.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const createReplies = async (postId, content) => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/posts/${postId}/replies`,
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

    if (response.status === 401) throw new Error("Missing session.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
