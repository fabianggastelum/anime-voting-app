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
      // Use the correct token key from constants
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      // Use the full API URL from constants
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.RANDOM_PAIR}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch characters: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched characters:", data); // Debug log
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
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

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
    return <div>Loading characters...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show character pair
  if (characters && characters.length === 2) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={characters[0].imageUrl}
            alt={characters[0].name}
            style={{ width: "200px", height: "300px", objectFit: "cover" }}
          />
          <h3>{characters[0].name}</h3>
          <p>{characters[0].anime}</p>
          <button
            onClick={() => handleVote(characters[0].id)}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Voting..." : `Vote for ${characters[0].name}`}
          </button>
        </div>

        <div style={{ fontSize: "24px", fontWeight: "bold" }}>VS</div>

        <div style={{ textAlign: "center" }}>
          <img
            src={characters[1].imageUrl}
            alt={characters[1].name}
            style={{ width: "200px", height: "300px", objectFit: "cover" }}
          />
          <h3>{characters[1].name}</h3>
          <p>{characters[1].anime}</p>
          <button
            onClick={() => handleVote(characters[1].id)}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Voting..." : `Vote for ${characters[1].name}`}
          </button>
        </div>
      </div>
    );
  }

  // Handle case where data doesn't match expected format
  return <div>No characters available for voting</div>;
};

export default VotingPair;
