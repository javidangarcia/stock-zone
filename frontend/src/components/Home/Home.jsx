import "./Home.css";

export default function Home({ user }) {
    return (
        <div className="home">
            <p>Hi there, {user?.username ?? "guest"}.</p>
        </div>
    );
}
