import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserProfile from "./components/profile/UserProfile";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/products" element={<Home />} />
            <Route path="/categories" element={<Home />} />
            <Route path="/about" element={<Home />} />
            <Route path="/contact" element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
