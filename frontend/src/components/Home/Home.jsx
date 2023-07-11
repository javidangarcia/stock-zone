import "./Home.css";
import StockNews from "../StockNews/StockNews";
import StocksYouFollow from "../StocksYouFollow/StocksYouFollow";

export default function Home() {

    return (
        <div className="home">
            <StockNews />
            <StocksYouFollow />
        </div>
    );
}
