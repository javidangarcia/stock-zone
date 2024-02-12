export const registerUser = async registerBody => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/register`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody),
        }
    );

    if (response.status === 400) throw new Error("Please fill out all fields.");

    if (response.status === 409)
        throw new Error("This username or email already exists.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const signIn = async userCredentials => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
    });

    if (response.status === 400) throw new Error("Please fill out all fields.");

    if (response.status === 401)
        throw new Error("Invalid username or password.");

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};

export const signOut = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/logout`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (response.status === 500)
        throw new Error("Oops! Something went wrong on our end.");

    return await response.json();
};
