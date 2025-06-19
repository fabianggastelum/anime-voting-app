import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        marginTop: "4rem",
      }}
    >
      <h1 style={{ color: "#dc3545", marginBottom: "1rem" }}>
        🚫 Access Denied
      </h1>

      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        You don't have permission to access this page.
      </p>

      <p style={{ color: "#6c757d", marginBottom: "2rem" }}>
        {user ? (
          <>
            Logged in as: <strong>{user.username}</strong> (Role: {user.role})
          </>
        ) : (
          "You need to be logged in as an administrator."
        )}
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={handleGoBack}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>

        <Link
          to="/"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
