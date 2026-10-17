import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from "react-router-dom";

function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800">

      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Home />} />
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
          <Route path="/register" element={<Register onRegisterSuccess={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
