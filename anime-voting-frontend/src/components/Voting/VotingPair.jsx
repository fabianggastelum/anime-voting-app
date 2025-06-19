import React, { useState, useEffect } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from "../../utils/constants";

const VotingPair = () => {
  const [characters, setCharacters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomPair = async () => {
    setLoading(true);
    setError(null);

    try {
      // No authentication needed to view characters
      const fullUrl = `${API_BASE_URL}${API_ENDPOINTS.RANDOM_PAIR}`;
      console.log("Fetching from URL:", fullUrl); // Debug log

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status); // Debug log
      console.log("Response ok:", response.ok); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response body:", errorText); // Debug log
        throw new Error(
          `Failed to fetch characters: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched characters:", data); // Debug log
      console.log("Characters array length:", data?.length); // Debug log
      setCharacters(data);
    } catch (err) {
      console.error("Error fetching characters:", err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (winnerId) => {
    // Prevent double voting by disabling buttons
    setLoading(true);

    try {
      // Authentication required for voting
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!token) {
        throw new Error("Authentication required to vote. Please log in.");
      }

      // POST to /api/Votes/{winnerId}
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.VOTE}/${winnerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to submit vote: ${response.status} ${response.statusText}`
        );
      }

      console.log("Vote submitted successfully for character:", winnerId);

      // Immediately fetch a new pair after successful vote
      await fetchRandomPair();
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError(`Failed to submit vote: ${err.message}`);
      setLoading(false); // Re-enable buttons on error
    }
  };

  useEffect(() => {
    fetchRandomPair();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
        }}
      >
        Loading characters...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "20px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchRandomPair}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid white",
              color: "white",
              padding: "12px 24px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show character pair
  if (characters && characters.length === 2) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Title */}
        <h1
          style={{
            color: "#FFD700",
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "60px",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Vote for your favorite!
        </h1>

        {/* Character Cards Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "60px",
            flexWrap: "wrap",
            maxWidth: "1200px",
          }}
        >
          {/* Character 1 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              minWidth: "300px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
            }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #4a90e2, #357abd)",
                borderRadius: "15px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <img
                src={characters[0].imageUrl}
                alt={characters[0].name}
                style={{
                  width: "250px",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
            <h2
              style={{
                color: "#FFD700",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "15px 0 5px 0",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {characters[0].name}
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "18px",
                marginBottom: "25px",
              }}
            >
              {characters[0].anime}
            </p>
            <button
              onClick={() => handleVote(characters[0].id)}
              disabled={loading}
              style={{
                background: loading
                  ? "rgba(255, 255, 255, 0.3)"
                  : "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                border: "none",
                color: "white",
                padding: "15px 30px",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
                }
              }}
            >
              {loading ? "Voting..." : `Vote for ${characters[0].name}`}
            </button>
          </div>

          {/* VS Divider */}
          <div
            style={{
              color: "#FFD700",
              fontSize: "36px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              padding: "0 20px",
            }}
          >
            VS
          </div>

          {/* Character 2 */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              minWidth: "300px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
            }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #9b59b6, #8e44ad)",
                borderRadius: "15px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <img
                src={characters[1].imageUrl}
                alt={characters[1].name}
                style={{
                  width: "250px",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
            <h2
              style={{
                color: "#FFD700",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "15px 0 5px 0",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {characters[1].name}
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "18px",
                marginBottom: "25px",
              }}
            >
              {characters[1].anime}
            </p>
            <button
              onClick={() => handleVote(characters[1].id)}
              disabled={loading}
              style={{
                background: loading
                  ? "rgba(255, 255, 255, 0.3)"
                  : "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                border: "none",
                color: "white",
                padding: "15px 30px",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "25px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
                }
              }}
            >
              {loading ? "Voting..." : `Vote for ${characters[1].name}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where data doesn't match expected format
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #3b82f6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
      }}
    >
      No characters available for voting
    </div>
  );
};

export default VotingPair;
