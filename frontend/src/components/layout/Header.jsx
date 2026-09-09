import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../common/SearchBar";
import Toast from "../common/Toast";
import useNotify from "../../hooks/useNotify";
import { baseApi } from "../../app/baseApi";
import { logout, selectCurrentUser } from "../../features/auth/authSlice";

function Header() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notify, toastProps } = useNotify();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    notify("You have been logged out");
    navigate("/");
  };

  return (
    <>
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

            <div className="me-lg-3 mb-2 mb-lg-0">
              <SearchBar />
            </div>

            {user ? (
              <div className="d-flex align-items-center gap-2">
                {user.role === "admin" && (
                  <Link className="btn btn-outline-light btn-sm" to="/admin">
                    Admin
                  </Link>
                )}
                <span className="navbar-text text-white">Hi, {user.name}</span>
                <button type="button" className="btn btn-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Toast {...toastProps} />
    </>
  );
}

export default Header;
