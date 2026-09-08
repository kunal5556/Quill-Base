import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (query) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg site-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <FontAwesomeIcon icon={faFeatherPointed} />
          <span className="navbar-brand-text">Quill Base</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories">
                Categories
              </NavLink>
            </li>
          </ul>

          <form className="d-flex me-lg-3 mb-2 mb-lg-0" role="search" onSubmit={handleSearch}>
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

          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-light btn-sm" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
