import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Header with public navigation for Vote and Leaderboard
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
        padding: "1rem 0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="container flex flex-between">
        <div className="flex">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1
              style={{
                color: "white",
                margin: 0,
                fontSize: "2rem",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Touhyou
            </h1>
          </Link>
        </div>
        <nav className="flex" style={{ gap: "0.5rem", alignItems: "center" }}>
          {/* Public navigation - visible to everyone */}
          <Link
            to="/vote"
            style={{
              backgroundColor: "#7c2d92",
              color: "white",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "2px solid #7c2d92",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#9333ea";
              e.target.style.borderColor = "#9333ea";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#7c2d92";
              e.target.style.borderColor = "#7c2d92";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Vote
          </Link>
          <Link
            to="/leaderboard"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "2px solid rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
              e.target.style.borderColor = "rgba(255,255,255,0.5)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Leaderboard
          </Link>

          {/* Authentication-specific buttons */}
          {isAuthenticated ? (
            <>
              {/* Admin Dashboard button - only show for Admin users */}
              {user?.role === "Admin" && (
                <Link
                  to="/admin"
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    border: "2px solid #f59e0b",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#d97706";
                    e.target.style.borderColor = "#d97706";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#f59e0b";
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Admin Dashboard
                </Link>
              )}
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  marginLeft: "1rem",
                  fontWeight: "500",
                }}
              >
                Welcome, {user?.username || "User"}!
              </span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  border: "2px solid #ef4444",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#dc2626";
                  e.target.style.borderColor = "#dc2626";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#ef4444";
                  e.target.style.borderColor = "#ef4444";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  backgroundColor: "#06b6d4",
                  color: "white",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  border: "2px solid #06b6d4",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0891b2";
                  e.target.style.borderColor = "#0891b2";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#06b6d4";
                  e.target.style.borderColor = "#06b6d4";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  border: "2px solid #10b981",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.borderColor = "#059669";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.borderColor = "#059669";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
