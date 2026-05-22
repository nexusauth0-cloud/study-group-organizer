import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './components/auth/Profile';
import Groups from './pages/Groups';
import GroupDetail from './components/groups/GroupDetail';
import Scheduler from './pages/Scheduler';
import Mentors from './pages/Mentors';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
      {user && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <main className={`${user ? 'pt-16 lg:pl-64' : ''} min-h-screen`}>
        <div className={`${user ? 'p-4 sm:p-6' : ''}`}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/scheduler" element={<ProtectedRoute><Scheduler /></ProtectedRoute>} />
            <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
