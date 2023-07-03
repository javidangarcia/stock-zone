import './StockData.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function StockData({ currentStock }) {
    const API_KEY_1 = "5DIHMIONQPZFEG6R";
    const API_KEY_2 = "ciefl6pr01qmfas4d2hgciefl6pr01qmfas4d2i0";
    const [stockData, setStockData] = useState({});
    const [stockPrice, setStockPrice] = useState({});

    useEffect( () => {
        const fetchStockData = async () => {
            try {
                const infoUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${currentStock}&apikey=${API_KEY_1}`;
                const priceUrl = `https://finnhub.io/api/v1/quote?symbol=${currentStock}&token=${API_KEY_2}`;
                const responseInfo = await axios.get(infoUrl);
                const responsePrice = await axios.get(priceUrl)
                const infoData = responseInfo.data;
                const priceData = responsePrice.data;
                setStockData(infoData);
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