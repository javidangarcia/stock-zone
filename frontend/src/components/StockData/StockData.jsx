import './StockData.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ALPHA_API_KEY, FINNHUB_API_KEY } from "../../constants";

export default function StockData({ currentStock }) {
    const [stockData, setStockData] = useState({});
    const [stockPrice, setStockPrice] = useState({});

    useEffect( () => {
        const fetchStockData = async () => {
            try {
                const stockOverviewURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${currentStock}&apikey=${ALPHA_API_KEY}`;
                const stockPriceURL = `https://finnhub.io/api/v1/quote?symbol=${currentStock}&token=${FINNHUB_API_KEY}`;
                const responseOverview = await axios.get(stockOverviewURL);
                const responsePrice = await axios.get(stockPriceURL);
                const overviewData = responseOverview.data;
                const priceData = responsePrice.data;
                setStockData(overviewData);
                setStockPrice(priceData);
            } catch(error) {
                
            }
        }
        fetchStockData();
    }, [currentStock]);
    
    return (
        <div className="stock-data">
            <p>Ticker: {currentStock}</p>
            <p>Name: {stockData.Name}</p>
            <p>Description: {stockData.Description}</p>
            <p>Sector: {stockData.Sector}</p>
            <p>Price: {stockPrice.c}</p>
        </div>
    )
}