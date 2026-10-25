import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <header className="admin-topbar">

      <div className="topbar-left">

        <div className="mobile-page-title">
          Dashboard
        </div>

      </div>

      <div className="topbar-right">

        <div className="topbar-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search projects, leads..."
          />

          <span className="search-shortcut">
            Ctrl K
          </span>
        </div>

        <button className="notification-button">
          <Bell size={19} />

          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <button className="admin-profile">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-details">
            <strong>
              {user?.name || "Administrator"}
            </strong>

            <span>
              {user?.role || "Admin"}
            </span>
          </div>

          <ChevronDown
            size={16}
            className="profile-chevron"
          />

        </button>

      </div>

    </header>
  );
};

export default Topbar;