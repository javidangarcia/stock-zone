export const registerUser = async registerBody => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER}/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody),
        }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    return data;
};

export const signIn = async userCredentials => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    return data;
};
