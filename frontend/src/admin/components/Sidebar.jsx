import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  Sparkles,
  MessageSquareText,
  FileText,
  CircleHelp,
  Search,
  LogOut,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "PROPERTY MANAGEMENT",
    items: [
      {
        label: "Projects",
        path: "/admin/projects",
        icon: Building2,
      },
      {
        label: "Builders",
        path: "/admin/builders",
        icon: Users,
      },
      {
        label: "Localities",
        path: "/admin/localities",
        icon: MapPin,
      },
      {
        label: "Amenities",
        path: "/admin/amenities",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "CONTENT & CRM",
    items: [
      {
        label: "Leads",
        path: "/admin/leads",
        icon: MessageSquareText,
      },
      {
        label: "Articles",
        path: "/admin/articles",
        icon: FileText,
      },
      {
        label: "FAQs",
        path: "/admin/faqs",
        icon: CircleHelp,
      },
      {
        label: "SEO",
        path: "/admin/seo",
        icon: Search,
      },
    ],
  },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">

      <div className="sidebar-brand">
        <div className="brand-mark">
          P
        </div>

        <div className="brand-content">
          <div className="brand-title">
            Pune Property
          </div>

          <div className="brand-subtitle">
            Real Estate Platform
          </div>
        </div>
      </div>

      <div className="sidebar-scroll">

        {menuGroups.map((group) => (
          <div
            className="sidebar-group"
            key={group.title}
          >
            <div className="sidebar-group-title">
              {group.title}
            </div>

            <nav className="sidebar-nav">

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="sidebar-link-icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>

                    <span className="sidebar-link-label">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}

            </nav>
          </div>
        ))}

      </div>

      <div className="sidebar-footer">

        <NavLink
          to="/admin/profile"
          className="sidebar-footer-link"
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <button
          className="sidebar-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>

        <div className="sidebar-version">
          Admin v1.0
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;