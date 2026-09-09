import { useState } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="row g-4">
      <div className="col-12 d-lg-none">
        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsDrawerOpen(true)}>
          <FontAwesomeIcon icon={faBars} className="me-2" />
          Admin menu
        </button>
      </div>

      <div className="col-lg-3 d-none d-lg-block">
        <AdminSidebar />
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="p-3" style={{ width: 240 }}>
          <AdminSidebar onNavigate={() => setIsDrawerOpen(false)} />
        </div>
      </Drawer>

      <div className="col-12 col-lg-9">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
