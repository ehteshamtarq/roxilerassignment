import './SearchBox.css';

const SearchBox = ({searchBox, setSearchBox}) => {

  const handleChange = (event) => {
    setSearchBox(event.target.value)
  };

  return (
    <div className="search-box">
      <input value={searchBox} onChange={handleChange} placeholder="Search Transaction" className="text-box" />
    </div>
  );
};

export default SearchBox;