import "./Loading.css";
import { useContext } from "react";
import { UserContext } from "../App/App";

export default function Loading() {
    const { loading } = useContext(UserContext);

    return loading ? (
        <div
            className="loading-container"
            style={{ "minHeight": "calc(100vh - 90px)" }}
        >
            <div
                className="spinner-border text-primary"
                style={{ height: "200px", width: "200px" }}
                role="status"
            ></div>
        </div>
    ) : null;
}
