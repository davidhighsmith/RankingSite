import './SearchBar.css';

const SearchBar = ({ search, updateSearch, submit }) => {
  return (
    <form onSubmit={submit}>
      <div className="search-bar-container">
        <input className={`search-bar ${search === '' ? '' : "search-bar-filled" }`} type="text" value={search} onChange={updateSearch} />
        <input className="search-submit" type="submit" value="Search" />
      </div>
    </form>
  )
};

export default SearchBar;
