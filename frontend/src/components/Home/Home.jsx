import "./Home.css"

export default function Home({ user }) {
    return (
        <div className="home">
            {user && <p>Hi there, {user.username}.</p>}
        </div>
    )
}
