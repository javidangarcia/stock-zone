import "./Loading.css";
import { useSelector } from "react-redux";

export default function Loading() {
    const loading = useSelector((state) => state.loading);

    return loading ? (
        <div
            className="loading-container"
            style={{ minHeight: "calc(100vh - 90px)" }}
        >
            <div
                className="spinner-border text-primary"
                style={{ height: "200px", width: "200px" }}
                role="status"
            />
        </div>
    ) : null;
}
