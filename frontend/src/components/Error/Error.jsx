import "./Error.css";
import { useEffect, useContext } from "react";
import { UserContext } from "../App/App";
import { useLocation } from "react-router-dom";

export default function Error({ error }) {
    const { setError } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        setError(null);
    }, [location.pathname]);

    const handleClose = () => {
        setError(null);
    };

    return (
        <div className={error ? "error" : "hidden"}>
            <p>{error}</p>
            <button onClick={handleClose}>Close</button>
        </div>
    );
}
