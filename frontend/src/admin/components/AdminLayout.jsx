import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate("/admin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <div className="admin-layout">

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "mobile-open" : ""
        }`}
      >

        {/* BRAND */}
        <div className="sidebar-brand">

          <div className="brand-mark">
            PP
          </div>

          <div className="brand-content">
            <div className="brand-title">
              Pune Property
            </div>

            <div className="brand-subtitle">
              Admin Panel
            </div>
          </div>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>


        {/* SIDEBAR NAVIGATION */}
        <div className="sidebar-scroll">

          {/* MAIN */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              MAIN
            </div>

            <nav className="sidebar-nav">

              <NavLink
                to="/admin/dashboard"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  ▦
                </span>

                <span className="sidebar-link-label">
                  Dashboard
                </span>
              </NavLink>

            </nav>

          </div>


          {/* PROPERTY */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              PROPERTY
            </div>

            <nav className="sidebar-nav">

              <NavLink
                to="/admin/projects"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  🏢
                </span>

                <span className="sidebar-link-label">
                  Projects
                </span>
              </NavLink>


              <NavLink
                to="/admin/builders"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  👥
                </span>

                <span className="sidebar-link-label">
                  Builders
                </span>
              </NavLink>


              <NavLink
                to="/admin/localities"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  📍
                </span>

                <span className="sidebar-link-label">
                  Localities
                </span>
              </NavLink>


              <NavLink
                to="/admin/amenities"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  ✦
                </span>

                <span className="sidebar-link-label">
                  Amenities
                </span>
              </NavLink>

            </nav>

          </div>


          {/* CONTENT */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              CONTENT
            </div>

            <nav className="sidebar-nav">

              <NavLink
                to="/admin/leads"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  ▤
                </span>

                <span className="sidebar-link-label">
                  Leads
                </span>
              </NavLink>


              <NavLink
                to="/admin/articles"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  ◫
                </span>

                <span className="sidebar-link-label">
                  Articles
                </span>
              </NavLink>


              <NavLink
                to="/admin/faqs"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <span className="sidebar-link-icon">
                  ?
                </span>

                <span className="sidebar-link-label">
                  FAQs
                </span>
              </NavLink>

            </nav>

          </div>

        </div>


        {/* SIDEBAR FOOTER */}
        <div className="sidebar-footer">

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>
              ⇥
            </span>

            <span>
              Logout
            </span>
          </button>

          <div className="sidebar-version">
            Pune Property v1.0
          </div>

        </div>

      </aside>


      {/* ========================================
          MAIN AREA
      ======================================== */}
      <main className="admin-main">

        {/* ========================================
            TOPBAR
        ======================================== */}
        <header className="admin-topbar">

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>


          {/* TOPBAR LEFT */}
          <div className="topbar-left">

            <div className="topbar-page-title">
              Admin Dashboard
            </div>

          </div>


          {/* TOPBAR RIGHT */}
          <div className="topbar-right">

            {/* SEARCH */}
            <div className="topbar-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search..."
              />

              <span className="search-shortcut">
                Ctrl K
              </span>

            </div>


            {/* NOTIFICATION */}
            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              ♧

              <span className="notification-dot" />
            </button>


            <div className="topbar-divider" />


            {/* PROFILE */}
            <div className="admin-profile">

              <div className="profile-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "A"}
              </div>

              <div className="profile-details">

                <strong>
                  {user?.name || "Admin"}
                </strong>

                <span>
                  Administrator
                </span>

              </div>

              <span className="profile-chevron">
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* ========================================
            PAGE CONTENT
        ======================================== */}
        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;