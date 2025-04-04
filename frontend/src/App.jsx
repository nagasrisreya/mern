import { useState } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/auth";

/**
 * Layout Component to ensure footer stays at the bottom
 */
const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content - Expands to push footer down */}
      <Box as="main" flex="1" py={8} px={4}>
        {children}
      </Box>

      {/* Footer Stays at Bottom */}
      <Box
        as="footer"
        py={4}
        bg={useColorModeValue("gray.200", "gray.700")}
        mt="auto"
        textAlign="center"
      >
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
          &copy; {new Date().getFullYear()} Travel Log. All rights reserved.
        </Text>
      </Box>
    </Flex>
  );
};

/**
 * Protected Route - Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [selectedState, setSelectedState] = useState(""); // State filter
  const { user } = useAuthStore(); // Get authentication state

  return (
    <Routes>
      {/* Home Page - Pass search and filter states properly */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
          </Layout>
        }
      />
      
      {/* Protected Create Page */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreatePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Contact Page */}
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
      
      {/* Authentication Routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
    </Routes>
  );
}

export default App;
