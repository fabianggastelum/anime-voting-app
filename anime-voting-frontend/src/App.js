import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import Header from "./components/Layout/Header";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import VotingPair from "./components/Voting/VotingPair";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/vote"
                element={
                  <ProtectedRoute>
                    <VotingPair />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/vote" replace />} />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
