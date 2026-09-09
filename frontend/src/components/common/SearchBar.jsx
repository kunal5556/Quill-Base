import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (query) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Search posts"
          aria-label="Search posts"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button className="btn btn-light" type="submit" aria-label="Search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
