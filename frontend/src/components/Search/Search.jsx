import './Search.css'
import StockData from '../StockData/StockData'
 
export default function Search({ searchInput, setSearchInput, handleSearchSubmit, currentStock }) {
    return (
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input  type="text" 
                        placeholder="Search for a Stock..."
                        value={searchInput}
                        onChange={ (event) => setSearchInput(event.target.value) }
                />
                <button type="submit">
                    <i className="material-icons">search</i>
                </button>
            </form>

            {currentStock && <StockData currentStock={currentStock}/>}

        </div>
    )
}