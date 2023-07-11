import "./Home.css";
import { UserContext } from "../App/App";
import { useContext } from "react";

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <div className="home">
            <p>Hi there, {user?.username ?? "guest"}.</p>
        </div>
    );
}
