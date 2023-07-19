import "./Error.css";
import { useEffect, useContext } from "react";
import { UserContext } from "../App/App";
import { useLocation } from "react-router-dom";

export default function Error({ errorMessage }) {
    const { setErrorMessage } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        setErrorMessage(null);
    }, [location.pathname]);

    const handleClose = () => {
        setErrorMessage(null);
    };

    return (
        <div className={errorMessage ? "errorMessage" : "hidden"}>
            <p>{errorMessage}</p>
            <button onClick={handleClose}>Close</button>
        </div>
    );
}
