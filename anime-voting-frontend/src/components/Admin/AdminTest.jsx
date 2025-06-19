import React from "react";
import AdminLayout from "./AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminTest = () => {
  const { user } = useAuth();

  return (
    <AdminLayout title="Admin Test Page">
      <div>
        <h2>🛡️ Admin Test Page</h2>

        <div
          style={{
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h3>✅ Admin Layout Working!</h3>
          <p>The sidebar navigation and layout structure is now complete.</p>
        </div>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            padding: "1rem",
          }}
        >
          <h4>User Information:</h4>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTest;
