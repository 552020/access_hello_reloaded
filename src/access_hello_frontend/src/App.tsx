import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/index";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import InternetIdentityDemo from "@/pages/demo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isAuthenticated={isAuthenticated} />}>
          <Route index element={<Home />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="demo" element={<InternetIdentityDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
