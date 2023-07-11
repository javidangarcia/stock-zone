import "./Error.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App/App";

export default function Error({ error }) {
    const [errorMessage, setErrorMessage] = useState(error);
    const { setError } = useContext(UserContext);

    useEffect(() => {
        setErrorMessage(error);

        setTimeout(() => {
            setErrorMessage("");
            setError("");
        }, 3000);

    }, [error]);

    return (
        <div className={errorMessage ? "error" : "hidden"}>
            <p>{errorMessage}</p>
        </div>
    );
}
