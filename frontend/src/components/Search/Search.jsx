import './Search.css'
 
export default function Search({ searchInput, setSearchInput, stockSearchSubmit }) {
    return (
        <div className="search">
            <input  type="text" 
                    placeholder="Search"
                    value={searchInput}
                    onChange={ (event) => setSearchInput(event.target.value) }
            />
            <button onClick={stockSearchSubmit}><i className="material-icons">search</i></button>
        </div>
    )
}