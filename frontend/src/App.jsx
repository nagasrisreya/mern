import { useState } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register"; // ✅ Fixed import
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/auth"; // ✅ Import authentication store

/**
 * Layout Component to wrap pages with Navbar and Footer
 */
const Layout = ({ children, searchTerm, setSearchTerm, selectedState, setSelectedState }) => {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
      />

      {/* Main Content */}
      <Box as="main" py={8} px={4}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        py={4}
        bg={useColorModeValue("gray.200", "gray.700")}
        mt={10}
        textAlign="center"
      >
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
          &copy; {new Date().getFullYear()} Travel Log. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Protected Route - Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ element }) => {
  const { user } = useAuthStore();
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedState, setSelectedState] = useState(""); // State for selected state filter
  const { user } = useAuthStore(); // Get authentication state

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          >
            <HomePage searchTerm={searchTerm} selectedState={selectedState} />
          </Layout>
        }
      />
      {/* ✅ Protected Route: Only logged-in users can access CreatePage */}
      <Route
        path="/create"
        element={
          <ProtectedRoute
            element={
              <Layout>
                <CreatePage />
              </Layout>
            }
          />
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">
              Contact Us
            </Text>
          </Layout>
        }
      />
      {/* ✅ Authentication Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />
    </Routes>
  );
}

export default App;
