import './App.css'
import Navbar from '../Navbar/Navbar'
import Search from '../Search/Search'
import { useState } from 'react';

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  function stockSearchSubmit() {
    setCurrentStock(searchInput);
  }

  return (
    <div className="app">
      <Navbar />
      <Search 
          searchInput={searchInput} 
          setSearchInput={setSearchInput} 
          stockSearchSubmit={stockSearchSubmit}
          currentStock={currentStock}
      />
    </div>
  )
}