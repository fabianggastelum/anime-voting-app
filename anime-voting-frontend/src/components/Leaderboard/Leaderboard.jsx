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
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering

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

  // Filter leaderboard data based on search term
  const filteredLeaderboardData = leaderboardData.filter((character) => {
    const searchLower = searchTerm.toLowerCase();
    const characterName = character.name?.toLowerCase() || "";
    const animeName = character.anime?.toLowerCase() || "";

    return (
      characterName.includes(searchLower) || animeName.includes(searchLower)
    );
  });

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    fetchLeaderboard(); // Call fetch function on component mount
  }, []); // Empty dependency array means this runs once on mount

  // Loading state UI
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
          padding: "2rem 0",
        }}
      >
        <div className="container">
          <div className="text-center">
            <h1
              style={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "2rem",
              }}
            >
              Character Leaderboard
            </h1>
            <div className="mt-4">
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "4px solid rgba(255,255,255,0.3)",
                  borderTop: "4px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto",
                }}
              ></div>
              <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "1rem" }}>
                Loading leaderboard data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
          padding: "2rem 0",
        }}
      >
        <div className="container">
          <div className="text-center">
            <h1
              style={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "2rem",
              }}
            >
              Character Leaderboard
            </h1>
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "2px solid #ef4444",
                borderRadius: "12px",
                padding: "2rem",
                margin: "2rem auto",
                maxWidth: "500px",
              }}
            >
              <h4 style={{ color: "#ef4444", marginBottom: "1rem" }}>
                Error Loading Leaderboard
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: "1.5rem",
                }}
              >
                {error}
              </p>
              <button
                onClick={fetchLeaderboard}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "2px solid #ef4444",
                  padding: "0.75rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main leaderboard UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-5">
          <h1
            style={{
              color: "white",
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Character Leaderboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.2rem",
              marginBottom: "2rem",
            }}
          >
            Top {leaderboardData.length} most voted anime characters!
          </p>

          {/* Search Bar */}
          <div
            style={{
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem auto",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search by character name or anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1.1rem",
                  backdropFilter: "blur(10px)",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(251,191,36,0.8)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "1.2rem",
                }}
              >
                🔍
              </div>
            </div>
            {searchTerm && (
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                  textAlign: "center",
                }}
              >
                Showing {filteredLeaderboardData.length} of{" "}
                {leaderboardData.length} characters
              </p>
            )}
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Check if we have data to display */}
        {leaderboardData.length === 0 ? (
          <div className="text-center">
            <div
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "12px",
                padding: "3rem",
                margin: "2rem auto",
                maxWidth: "600px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h4 style={{ color: "white", marginBottom: "1rem" }}>
                No Data Available
              </h4>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>
                No characters have received votes yet. Start voting to see the
                leaderboard!
              </p>
            </div>
          </div>
        ) : filteredLeaderboardData.length === 0 ? (
          /* No search results */
          <div className="text-center">
            <div
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "12px",
                padding: "3rem",
                margin: "2rem auto",
                maxWidth: "600px",
                backdropFilter: "blur(10px)",
              }}
            >
              <h4 style={{ color: "white", marginBottom: "1rem" }}>
                No Results Found
              </h4>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>
                No characters match your search term "{searchTerm}". Try
                searching with different keywords.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  backgroundColor: "rgba(251,191,36,0.2)",
                  color: "#fbbf24",
                  border: "2px solid #fbbf24",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "1rem",
                  transition: "all 0.3s ease",
                }}
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          /* Leaderboard list */
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              {filteredLeaderboardData.map((character, index) => {
                // Get the original index from the full leaderboard data
                const originalIndex = leaderboardData.findIndex(
                  (item) => item.id === character.id
                );

                return (
                  <div
                    key={character.id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      marginBottom: "1.5rem",
                      border: "1px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(0,0,0,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Character image */}
                    <div style={{ marginRight: "2rem", flexShrink: 0 }}>
                      <div
                        style={{
                          width: "150px",
                          height: "200px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border:
                            originalIndex < 3
                              ? "3px solid #fbbf24"
                              : "2px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150x200?text=No+Image";
                          }}
                        />
                      </div>
                    </div>

                    {/* Character information */}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <h2
                          style={{
                            color: "#fbbf24",
                            fontSize: "1.8rem",
                            fontWeight: "bold",
                            margin: 0,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          Position #{originalIndex + 1}
                          {originalIndex < 3 && (
                            <span style={{ marginLeft: "0.5rem" }}>
                              {originalIndex === 0
                                ? "🥇"
                                : originalIndex === 1
                                ? "🥈"
                                : "🥉"}
                            </span>
                          )}
                        </h2>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <h3
                          style={{
                            color: "white",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            margin: 0,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {character.name}
                        </h3>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1.2rem",
                            margin: 0,
                          }}
                        >
                          {character.anime}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "1.4rem",
                            fontWeight: "600",
                            margin: 0,
                          }}
                        >
                          Total votes:{" "}
                          <span
                            style={{
                              color: "#fbbf24",
                              fontWeight: "bold",
                              fontSize: "1.6rem",
                            }}
                          >
                            {character.voteCount || character.votes || 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center mt-5">
          <small style={{ color: "rgba(255,255,255,0.6)" }}>
            Last updated: {new Date().toLocaleTimeString()} |
            <button
              onClick={fetchLeaderboard}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "underline",
                cursor: "pointer",
                marginLeft: "0.5rem",
                padding: 0,
              }}
            >
              Refresh now
            </button>
          </small>
        </div>
      </div>

      {/* Add CSS animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
