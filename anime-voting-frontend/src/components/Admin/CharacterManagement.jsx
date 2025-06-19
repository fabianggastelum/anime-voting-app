import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/constants";

const CharacterManagement = () => {
  // Get auth context
  const { token } = useAuth();

  // State management
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingCharacters, setAddingCharacters] = useState(false);
  const [deletingCharacterId, setDeletingCharacterId] = useState(null);

  // Add characters form state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [animeId, setAnimeId] = useState("");
  const [animeIdError, setAnimeIdError] = useState("");

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all characters when component mounts
  useEffect(() => {
    fetchCharacters();
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Debug state changes
  useEffect(() => {}, [showDeleteDialog, selectedCharacter]);

  // Function to fetch all characters from the API
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/Admin/characters`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please check your admin permissions.");
        } else if (response.status === 403) {
          throw new Error("Forbidden. Admin access required.");
        }
        throw new Error(`Failed to fetch characters: ${response.status}`);
      }

      const charactersData = await response.json();
      setCharacters(charactersData);
    } catch (err) {
      console.error("Error fetching characters:", err);
      setError(`Failed to load characters: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to add characters from anime
  const handleAddCharacters = async () => {
    // Validate anime ID
    if (!animeId.trim()) {
      setAnimeIdError("Please enter an anime ID");
      return;
    }

    // Check if it's a valid number
    if (isNaN(animeId) || parseInt(animeId) <= 0) {
      setAnimeIdError("Please enter a valid anime ID (positive number)");
      return;
    }

    try {
      setAddingCharacters(true);
      setAnimeIdError("");
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/Admin/characters/${animeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error("Unauthorized. Please check your admin permissions.");
        } else if (response.status === 403) {
          throw new Error("Forbidden. Admin access required.");
        } else if (response.status === 404) {
          throw new Error("Anime not found. Please check the anime ID.");
        } else if (response.status === 409) {
          throw new Error(
            "Some or all characters from this anime already exist."
          );
        }
        throw new Error(
          `Failed to add characters: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      // Close dialog and refresh characters list
      setShowAddDialog(false);
      setAnimeId("");
      await fetchCharacters();

      // Show success message
      setSuccessMessage(
        result.message ||
          `Successfully added characters from anime ID ${animeId}!`
      );
    } catch (err) {
      console.error("Error adding characters:", err);
      setAnimeIdError(err.message);
    } finally {
      setAddingCharacters(false);
    }
  };

  // Function to initiate character deletion
  const handleDeleteCharacter = (character) => {
    setSelectedCharacter(character);
    setShowDeleteDialog(true);
  };

  // Function to confirm character deletion
  const confirmDeleteCharacter = async () => {
    try {
      setDeletingCharacterId(selectedCharacter.id);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/Admin/characters/${selectedCharacter.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please check your admin permissions.");
        } else if (response.status === 403) {
          throw new Error("Forbidden. Admin access required.");
        } else if (response.status === 404) {
          throw new Error("Character not found.");
        }
        throw new Error(`Failed to delete character: ${response.status}`);
      }

      // Remove character from local state
      setCharacters((prevCharacters) =>
        prevCharacters.filter((char) => char.id !== selectedCharacter.id)
      );

      // Close dialog
      setShowDeleteDialog(false);
      setSelectedCharacter(null);
      // Show success message
      setSuccessMessage(
        `Successfully deleted character: ${selectedCharacter.name}`
      );
    } catch (err) {
      console.error("Error deleting character:", err);
      setError(`Failed to delete character: ${err.message}`);
    } finally {
      setDeletingCharacterId(null);
    }
  };

  // Function to cancel operations
  const cancelAddCharacters = () => {
    setShowAddDialog(false);
    setAnimeId("");
    setAnimeIdError("");
  };

  const cancelDeleteCharacter = () => {
    setShowDeleteDialog(false);
    setSelectedCharacter(null);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Character Management
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddDialog(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Add Characters from Anime
            </button>
            <button
              onClick={fetchCharacters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Refresh Characters
            </button>
          </div>
        </div>

        {/* Success message display */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Characters count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Total characters:{" "}
            <span className="font-semibold">{characters.length}</span>
          </p>
        </div>

        {/* Characters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Character Image */}
              <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                <img
                  src={character.imageUrl || "/placeholder-character.png"}
                  alt={character.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-character.png";
                  }}
                />
              </div>

              {/* Character Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {character.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Anime:</span>
                    <span className="font-medium truncate ml-2">
                      {character.anime}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Votes:</span>
                    <span className="font-medium text-blue-600">
                      {character.voteCount || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{character.id}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      console.log(
                        "Delete button clicked for character:",
                        character
                      );
                      handleDeleteCharacter(character);
                    }}
                    disabled={deletingCharacterId === character.id}
                    className="w-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {deletingCharacterId === character.id
                      ? "Deleting..."
                      : "Delete Character"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no characters found */}
        {characters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎭</div>
            <p className="text-gray-500 text-lg">No characters found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Add some characters from anime to get started!
            </p>
          </div>
        )}

        {/* Add Characters Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 border max-w-md w-full mx-4 shadow-xl rounded-lg bg-white">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add Characters from Anime
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Enter the MyAnimeList anime ID to import all characters from
                  that anime.
                </p>

                <div className="mb-4">
                  <input
                    type="number"
                    value={animeId}
                    onChange={(e) => setAnimeId(e.target.value)}
                    placeholder="Enter anime ID (e.g., 16498)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {animeIdError && (
                    <p className="text-red-600 text-sm mt-1">{animeIdError}</p>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelAddCharacters}
                    disabled={addingCharacters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCharacters}
                    disabled={addingCharacters}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
                  >
                    {addingCharacters ? "Adding..." : "Add Characters"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 border max-w-md w-full mx-4 shadow-xl rounded-lg bg-white">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Character
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedCharacter?.name}
                  </span>
                  ?
                </p>
                {selectedCharacter?.voteCount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ This character has{" "}
                      <strong>{selectedCharacter.voteCount} votes</strong>.
                      Deleting will permanently remove all vote data.
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelDeleteCharacter}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCharacter}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                  >
                    Delete Character
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

export default CharacterManagement;
