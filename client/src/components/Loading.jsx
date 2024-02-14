import { useSelector } from "react-redux";

export default function Loading() {
    const loading = useSelector(state => state.loading);

    return loading ? (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                zIndex: 9999,
                minHeight: "calc(100vh - 90px)",
            }}
        >
            <div
                className="spinner-border text-primary"
                style={{ height: "200px", width: "200px" }}
                role="status"
            />
        </div>
    ) : null;
}
