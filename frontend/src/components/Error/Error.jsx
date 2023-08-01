import "./Error.css";
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../../context";

export default function Error({ errorMessage }) {
    const { setErrorMessage } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        setErrorMessage(null);
    }, [location.pathname]);

    const handleClose = () => {
        setErrorMessage(null);
    };

    return (
        <div className={errorMessage ? "error" : "hidden"}>
            <p>{errorMessage}</p>
            <button type="button" onClick={handleClose}>
                Close
            </button>
        </div>
    );
}
