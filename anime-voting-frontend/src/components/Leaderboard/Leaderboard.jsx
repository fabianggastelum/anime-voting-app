import React, { useState, useEffect } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from "../../utils/constants";

const Leaderboard = () => {
  // State management for component data and UI states
  const [leaderboardData, setLeaderboardData] = useState([]); // Array of top characters
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for failed requests

  // Function to fetch leaderboard data from backend
  const fetchLeaderboard = async () => {
    setLoading(true); // Show loading state
    setError(null); // Clear any previous errors

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      // Make API call to get leaderboard data
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LEADERBOARD}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include auth token
            "Content-Type": "application/json",
          },
        }
      );

      // Check if request was successful
      if (!response.ok) {
        throw new Error(
          `Failed to fetch leaderboard: ${response.status} ${response.statusText}`
        );
      }

      // Parse JSON response
      const data = await response.json();
      console.log("Fetched leaderboard data:", data); // Debug log

      // Update state with fetched data
      setLeaderboardData(Array.isArray(data) ? data : []); // Ensure data is array
    } catch (err) {
      console.error("Error fetching leaderboard:", err); // Debug log
      setError(err.message); // Set error message for user
    } finally {
      setLoading(false); // Hide loading state regardless of success/failure
    }
  };

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    fetchLeaderboard(); // Call fetch function on component mount
  }, []); // Empty dependency array means this runs once on mount

  // Loading state UI
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h1>🏆 Character Leaderboard</h1>
          <div className="mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading leaderboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h1>🏆 Character Leaderboard</h1>
          <div className="alert alert-danger mt-4">
            <h4>Error Loading Leaderboard</h4>
            <p>{error}</p>
            <button
              className="btn btn-outline-danger"
              onClick={fetchLeaderboard}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main leaderboard UI
  return (
    <div className="container mt-4">
      {/* Header section */}
      <div className="text-center mb-4">
        <h1>🏆 Character Leaderboard</h1>
        <p className="text-muted">
          Top {leaderboardData.length} most voted anime characters!
        </p>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={fetchLeaderboard}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Check if we have data to display */}
      {leaderboardData.length === 0 ? (
        <div className="text-center">
          <div className="alert alert-info">
            <h4>No Data Available</h4>
            <p>
              No characters have received votes yet. Start voting to see the
              leaderboard!
            </p>
          </div>
        </div>
      ) : (
        /* Leaderboard list */
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {leaderboardData.map((character, index) => (
              <div key={character.id || index} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* Rank number */}
                    <div className="col-2 col-md-1 text-center">
                      <div
                        className={`rank-badge ${index < 3 ? "top-three" : ""}`}
                      >
                        {index < 3 ? (
                          // Special icons for top 3
                          <span className="fs-2">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          // Number for positions 4-10
                          <span className="fs-4 fw-bold text-muted">
                            #{index + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Character image */}
                    <div className="col-4 col-md-3 text-center">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="img-fluid rounded"
                        style={{
                          width: "80px",
                          height: "120px",
                          objectFit: "cover",
                          border:
                            index < 3 ? "3px solid gold" : "1px solid #ddd",
                        }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.src =
                            "https://via.placeholder.com/80x120?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Character details */}
                    <div className="col-6 col-md-6">
                      <h5 className="card-title mb-1">{character.name}</h5>
                      <p className="text-muted mb-2 small">{character.anime}</p>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">
                          {character.voteCount || character.votes || 0} votes
                        </span>
                        {/* Optional: Show percentage if total votes available */}
                        {character.percentage && (
                          <span className="text-muted small">
                            ({character.percentage}%)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Vote count (large display for mobile) */}
                    <div className="col-12 col-md-2 text-center mt-2 mt-md-0">
                      <div
                        className={`vote-count ${
                          index < 3 ? "text-warning fw-bold" : "text-primary"
                        }`}
                      >
                        <div className="fs-3">
                          {character.voteCount || character.votes || 0}
                        </div>
                        <small className="text-muted">votes</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="text-center mt-4 mb-4">
        <small className="text-muted">
          Last updated: {new Date().toLocaleTimeString()} |
          <button
            className="btn btn-link btn-sm p-0 ms-1"
            onClick={fetchLeaderboard}
          >
            Refresh now
          </button>
        </small>
      </div>
    </div>
  );
};

export default Leaderboard;
