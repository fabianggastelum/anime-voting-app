import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Navigation items
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "📊",
      exact: true,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "👥",
      exact: false,
    },
    {
      path: "/admin/characters",
      label: "Characters",
      icon: "🎭",
      exact: false,
    },
  ];

  // Check if nav item is active
  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "250px" : "60px",
          backgroundColor: "#343a40",
          color: "white",
          transition: "width 0.3s ease",
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #495057",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          {sidebarOpen && (
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>🛡️ Admin Panel</h3>
          )}
          <button
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "1rem 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                color: isActive(item) ? "#fff" : "#adb5bd",
                backgroundColor: isActive(item) ? "#495057" : "transparent",
                textDecoration: "none",
                borderLeft: isActive(item)
                  ? "3px solid #007bff"
                  : "3px solid transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item)) {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item)) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#adb5bd";
                }
              }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  marginRight: sidebarOpen ? "0.75rem" : "0",
                }}
              >
                {item.icon}
              </span>
              {sidebarOpen && (
                <span style={{ fontSize: "0.95rem" }}>{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
          }}
        >
          {sidebarOpen && (
            <div
              style={{
                backgroundColor: "#495057",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#adb5bd" }}>
                Logged in as:
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                {user?.username}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                Role: {user?.role}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            padding: "1rem 2rem",
            borderBottom: "1px solid #dee2e6",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#343a40" }}>
                {title}
              </h1>
              <nav
                style={{
                  fontSize: "0.9rem",
                  color: "#6c757d",
                  marginTop: "0.25rem",
                }}
              >
                <Link
                  to="/"
                  style={{ color: "#6c757d", textDecoration: "none" }}
                >
                  Home
                </Link>
                <span style={{ margin: "0 0.5rem" }}>/</span>
                <span>Admin</span>
                {location.pathname !== "/admin" && (
                  <>
                    <span style={{ margin: "0 0.5rem" }}>/</span>
                    <span style={{ textTransform: "capitalize" }}>
                      {location.pathname.split("/").pop()}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                Welcome, {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
