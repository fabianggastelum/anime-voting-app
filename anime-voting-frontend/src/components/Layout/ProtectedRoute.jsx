import React from "react";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: "50vh" }}>
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {isAuthenticated ? (
        children
      ) : (
        <div className="card text-center">
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
