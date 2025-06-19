import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import UserManagement from "./UserManagement";

const AdminDashboard = () => {
  const { user, token } = useAuth(); // Get token from context instead of localStorage
  const location = useLocation(); // Get current location for routing
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCharacters: 0,
    totalVotes: 0,
    isLoading: true,
    error: null,
  });

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = "https://localhost:7015/api";

  // Fetch admin stats when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, isLoading: true, error: null }));

        // Try to get token from auth context first, then fallback to localStorage
        const authToken = token || localStorage.getItem("token");

        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const headers = {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        };

        // Make parallel API calls to fetch all stats
        const [
          usersResponse,
          charactersResponse,
          votesResponse,
          statsResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/Admin/users`, { headers }),
          fetch(`${API_BASE_URL}/Admin/characters`, { headers }),
          fetch(`${API_BASE_URL}/Votes`, { headers }),
          fetch(`${API_BASE_URL}/Admin/stats`, { headers }),
        ]);

        // Check if all requests were successful
        if (!usersResponse.ok) {
          if (usersResponse.status === 401) {
            throw new Error(
              "Unauthorized - Please login again or contact admin for permissions"
            );
          }
          if (usersResponse.status === 403) {
            throw new Error("Forbidden - Admin privileges required");
          }
          throw new Error(`Failed to fetch users: ${usersResponse.status}`);
        }
        if (!charactersResponse.ok) {
          if (charactersResponse.status === 401) {
            throw new Error(
              "Unauthorized - Please login again or contact admin for permissions"
            );
          }
          if (charactersResponse.status === 403) {
            throw new Error("Forbidden - Admin privileges required");
          }
          throw new Error(
            `Failed to fetch characters: ${charactersResponse.status}`
          );
        }
        if (!votesResponse.ok) {
          if (votesResponse.status === 401) {
            throw new Error("Unauthorized - Please login again");
          }
          throw new Error(`Failed to fetch votes: ${votesResponse.status}`);
        }

        // Parse the responses
        const users = await usersResponse.json();
        const characters = await charactersResponse.json();
        const votes = await votesResponse.json();

        // Update state with real data
        setStats({
          totalUsers: users.length,
          totalCharacters: characters.length,
          totalVotes: votes.length,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to load statistics",
        }));
      }
    };

    // Only fetch if user is authenticated
    if (user) {
      fetchStats();
    } else {
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: "Please login to access admin dashboard",
      }));
    }
  }, [user, token]); // Add dependencies

  // Navigation cards configuration
  const adminSections = [
    {
      title: "Statistics",
      description: "View detailed system statistics and analytics",
      icon: "📈",
      path: "/admin",
      color: "#007bff",
      bgColor: "#e3f2fd",
      current:
        location.pathname === "/admin" || location.pathname === "/admin/stats",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts and roles",
      icon: "👥",
      path: "/admin/users",
      color: "#28a745",
      bgColor: "#e8f5e9",
      current: location.pathname === "/admin/users",
    },
    {
      title: "Manage Characters",
      description: "Add, edit, and remove anime characters",
      icon: "🎭",
      path: "/admin/characters",
      color: "#dc3545",
      bgColor: "#ffebee",
      current: location.pathname === "/admin/characters",
    },
  ];

  // Determine what content to render based on current path
  const renderContent = () => {
    switch (location.pathname) {
      case "/admin/users":
        return <UserManagement />;

      case "/admin/characters":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#6c757d", marginBottom: "1rem" }}>
              Character Management
            </h2>
            <p style={{ color: "#6c757d" }}>
              Character management features coming soon...
            </p>
          </div>
        );

      case "/admin":
      case "/admin/stats":
      default:
        return renderDashboardContent();
    }
  };

  // Extracted dashboard content into separate function for cleaner code
  const renderDashboardContent = () => (
    <>
      {/* Welcome Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            margin: "0 0 0.5rem 0",
            color: "#343a40",
            fontSize: "1.8rem",
          }}
        >
          👋 Welcome back, {user?.username}!
        </h2>
        <p
          style={{
            margin: "0 0 0.5rem 0",
            color: "#6c757d",
            fontSize: "1.1rem",
          }}
        >
          Here's what's happening with your anime voting system today.
        </p>
        {user?.role && (
          <p style={{ margin: 0, color: "#6c757d", fontSize: "0.9rem" }}>
            Role: {user.role}
          </p>
        )}
      </div>

      {/* Stats Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Total Users Stat */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #007bff",
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
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#007bff",
                  fontSize: "2rem",
                }}
              >
                {stats.isLoading ? "..." : stats.totalUsers.toLocaleString()}
              </h3>
              <p style={{ margin: 0, color: "#6c757d", fontSize: "1rem" }}>
                Total Users
              </p>
            </div>
            <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>👥</div>
          </div>
        </div>

        {/* Total Characters Stat */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #28a745",
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
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#28a745",
                  fontSize: "2rem",
                }}
              >
                {stats.isLoading
                  ? "..."
                  : stats.totalCharacters.toLocaleString()}
              </h3>
              <p style={{ margin: 0, color: "#6c757d", fontSize: "1rem" }}>
                Anime Characters
              </p>
            </div>
            <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>🎭</div>
          </div>
        </div>

        {/* Total Votes Stat */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #ffc107",
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
              <h3
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#ffc107",
                  fontSize: "2rem",
                }}
              >
                {stats.isLoading ? "..." : stats.totalVotes.toLocaleString()}
              </h3>
              <p style={{ margin: 0, color: "#6c757d", fontSize: "1rem" }}>
                Total Votes Cast
              </p>
            </div>
            <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>🗳️</div>
          </div>
        </div>
      </div>

      {/* Admin Actions Grid */}
      <div>
        <h3
          style={{
            margin: "0 0 1.5rem 0",
            color: "#343a40",
            fontSize: "1.4rem",
          }}
        >
          Admin Actions
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {adminSections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: section.current
                    ? "0 8px 16px rgba(0,0,0,0.15)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
                  border: section.current
                    ? `2px solid ${section.color}`
                    : `2px solid ${section.bgColor}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                  transform: section.current
                    ? "translateY(-4px)"
                    : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!section.current) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!section.current) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
                  }
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: section.current
                      ? section.color
                      : section.bgColor,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      filter: section.current
                        ? "brightness(0) invert(1)"
                        : "none",
                    }}
                  >
                    {section.icon}
                  </span>
                </div>

                <h4
                  style={{
                    margin: "0 0 0.75rem 0",
                    color: section.color,
                    fontSize: "1.3rem",
                  }}
                >
                  {section.title}
                </h4>

                <p
                  style={{
                    margin: 0,
                    color: "#6c757d",
                    lineHeight: "1.5",
                  }}
                >
                  {section.description}
                </p>

                <div
                  style={{
                    marginTop: "1rem",
                    color: section.color,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {section.current
                    ? `Current: ${section.title}`
                    : `Go to ${section.title} →`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {stats.error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "1rem",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            marginTop: "1rem",
          }}
        >
          <strong>Error:</strong> {stats.error}
        </div>
      )}
    </>
  );

  // Show loading state while auth is initializing
  if (!user && !stats.error) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      <div>{renderContent()}</div>
    </AdminLayout>
  );
};

export default AdminDashboard;
