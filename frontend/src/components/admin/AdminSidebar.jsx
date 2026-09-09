import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faComments, faFolder, faGauge, faNewspaper } from "@fortawesome/free-solid-svg-icons";

const links = [
  { to: "/admin", label: "Dashboard", icon: faGauge, end: true },
  { to: "/admin/posts", label: "Posts", icon: faNewspaper, end: false },
  { to: "/admin/categories", label: "Categories", icon: faFolder, end: false },
  { to: "/admin/comments", label: "Comments", icon: faComments, end: false },
];

function AdminSidebar({ onNavigate }) {
  return (
    <nav className="admin-sidebar">
      <ul className="nav flex-column">
        {links.map((link) => (
          <li className="nav-item" key={link.to}>
            <NavLink className="nav-link admin-nav-link" to={link.to} end={link.end} onClick={onNavigate}>
              <FontAwesomeIcon icon={link.icon} className="me-2" />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Link className="nav-link admin-nav-link mt-3" to="/" onClick={onNavigate}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to site
      </Link>
    </nav>
  );
}

export default AdminSidebar;
