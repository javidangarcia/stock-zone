import './Search.css'
import StockData from '../StockData/StockData'
 
export default function Search({ searchInput, setSearchInput, stockSearchSubmit, currentStock }) {
    return (
        <div className="search">
            <div className="stock-search">
                <input  type="text" 
                        placeholder="Search"
                        value={searchInput}
                        onChange={ (event) => setSearchInput(event.target.value) }
                />
                <button onClick={stockSearchSubmit}><i className="material-icons">search</i></button>
            </div>

            {currentStock && <StockData currentStock={currentStock}/>}

        </div>
    )
}