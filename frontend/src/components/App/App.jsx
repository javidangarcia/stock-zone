import './App.css'
import Navbar from '../Navbar/Navbar'
import Search from '../Search/Search'
import { useState } from 'react';

export default function App() {
  const [searchInput, setSearchInput] = useState("");

  function stockSearchSubmit() {
    // Do something
  }

  return (
    <div className="app">
      <Navbar />
      <Search searchInput={searchInput} setSearchInput={setSearchInput} stockSearchSubmit={stockSearchSubmit}/>
    </div>
  )
}