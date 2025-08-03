// App.js
import { useState } from 'react';
import DelayedInterviewSetup from './components/DelayedInterviewSetup'
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import HomePage from './components/HomePage'; // Make sure this path is correct
import Dashboard from "./components/Dashboard";
import InterviewSetup from "./components/InterviewSetup";
import Results from "./components/Results";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/home" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <Profile />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-setup"
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <DelayedInterviewSetup />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard" element={<ProtectedRoute>
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      </ProtectedRoute>} />
      <Route path="/results" element={
        <ProtectedRoute>
        <ErrorBoundary><Results />
         </ErrorBoundary>
      </ProtectedRoute> } />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;