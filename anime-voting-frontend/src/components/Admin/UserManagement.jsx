import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL, STORAGE_KEYS } from "../../utils/constants";

const UserManagement = () => {
  // Get auth context
  const { user: currentUser, token } = useAuth();

  // State management for component data and UI
  const [users, setUsers] = useState([]); // Store all users from API
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(""); // Error messages
  const [updatingUserId, setUpdatingUserId] = useState(null); // Track which user is being updated
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Control confirmation dialog
  const [selectedUser, setSelectedUser] = useState(null); // Store user being modified
  const [newRole, setNewRole] = useState(""); // Store the new role being assigned

  // Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch all users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true); // Show loading state
      setError(""); // Clear any previous errors

      // Debug: Log the token and URL
      console.log("Token:", token ? "Token exists" : "No token found");
      console.log("Current user:", currentUser);
      console.log("Fetching from:", `${API_BASE_URL}/Admin/users`);

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Make API call to get all users
      const response = await fetch(`${API_BASE_URL}/Admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
          "Content-Type": "application/json",
        },
      });

      // Debug: Log response details
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Get response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Check if request was successful
      if (!response.ok) {
        throw new Error(
          `Failed to fetch users: ${response.status} - ${responseText}`
        );
      }

      // Try to parse as JSON
      let usersData;
      try {
        usersData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      // Debug: Log the exact usernames being received
      console.log("Raw API response usernames:");
      usersData.forEach((user, index) => {
        console.log(
          `User ${index}: "${user.username}" (length: ${user.username?.length})`
        );
      });

      // Remove duplicates based on user ID
      const uniqueUsers = usersData.filter(
        (user, index, self) => index === self.findIndex((u) => u.id === user.id)
      );

      console.log("Final users count:", uniqueUsers.length);

      setUsers(uniqueUsers);
    } catch (err) {
      // Handle any errors during fetch
      console.error("Error fetching users:", err);
      setError(`Failed to load users: ${err.message}`);
    } finally {
      // Always turn off loading, whether success or error
      setLoading(false);
    }
  };

  // Function to initiate role change process
  const handleRoleChange = (user, role) => {
    // Don't allow changing your own role to prevent lockout
    if (currentUser?.id === user.id && role === "User") {
      setError("You cannot remove admin privileges from yourself.");
      return;
    }

    // Store the user and new role for confirmation dialog
    setSelectedUser(user);
    setNewRole(role);
    setShowConfirmDialog(true); // Show confirmation dialog
  };

  // Function to actually update the user role after confirmation
  const confirmRoleChange = async () => {
    try {
      setUpdatingUserId(selectedUser.id); // Show loading state for this specific user
      setError(""); // Clear any previous errors

      // Make API call to update user role
      const response = await fetch(
        `${API_BASE_URL}/Admin/users/${selectedUser.id}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }), // Send new role in request body
        }
      );

      // Check if update was successful
      if (!response.ok) {
        throw new Error(`Failed to update user role: ${response.status}`);
      }

      // Update the user in our local state without refetching all users
      setUsers((prevUsers) =>
        prevUsers.map(
          (user) =>
            user.id === selectedUser.id
              ? { ...user, role: newRole } // Update role for the specific user
              : user // Keep other users unchanged
        )
      );

      // Close confirmation dialog and reset state
      setShowConfirmDialog(false);
      setSelectedUser(null);
      setNewRole("");
    } catch (err) {
      // Handle any errors during update
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    } finally {
      // Always clear the updating state
      setUpdatingUserId(null);
    }
  };

  // Function to cancel role change
  const cancelRoleChange = () => {
    setShowConfirmDialog(false);
    setSelectedUser(null);
    setNewRole("");
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Main render of the component
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Refresh Users
          </button>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes Cast
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={`user-${user.id}-${user.username}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Username column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-lg"></span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {/* Debug: Log what we're about to render */}
                            {(() => {
                              console.log(
                                `Rendering username for user ${user.id}: "${user.username}"`
                              );
                              return user.username || "Unknown User";
                            })()}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role column with colored badges */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "Admin"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Vote count column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.voteCount || 0}
                      </div>
                    </td>

                    {/* Actions column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Show appropriate role change button */}
                        {user.role === "User" ? (
                          <button
                            onClick={() => handleRoleChange(user, "Admin")}
                            disabled={updatingUserId === user.id}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            {updatingUserId === user.id
                              ? "Updating..."
                              : "Make Admin"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user, "User")}
                            disabled={updatingUserId === user.id}
                            className="bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            {updatingUserId === user.id
                              ? "Updating..."
                              : "Remove Admin"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show message if no users found */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 border max-w-md w-full mx-4 shadow-xl rounded-lg bg-white">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Role Change
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to change{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedUser?.username}
                  </span>
                  's role to{" "}
                  <span className="font-semibold text-gray-900">{newRole}</span>
                  ?
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelRoleChange}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRoleChange}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
