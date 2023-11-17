'use client';

const SearchBar = () => {

    const handleSubmit = () => {}

  return (
    <div>
    <form onSubmit={handleSubmit} className=" flex flex-wrap gap-4 mt-12">
        <input 
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        />
        <button className="searchbar-btn" type="submit">Search</button>
    </form>        
    </div>
  )
}

export default SearchBar
