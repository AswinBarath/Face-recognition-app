import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { getAuthToken, authAPI } from './services/api';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FaceDetection from './pages/FaceDetection';
import History from './pages/History';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authAPI.getProfile()
        .then(({ user }) => {
          setUser(user);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar user={user} onLogout={() => setUser(null)} />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/dashboard" /> : <Register onRegister={setUser} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/detect" 
              element={
                user ? <FaceDetection user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/history" 
              element={
                user ? <History user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 