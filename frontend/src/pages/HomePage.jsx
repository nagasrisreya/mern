import React, { useState, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  HStack,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";
import { useAuthStore } from "../store/auth";
import ProductCard from "../components/ProductCard";
import SideNavbar from "../components/SideNavbar"; // Import the SideNavbar component

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStars, setSelectedStars] = useState(null); // State for star filter
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [user, fetchProducts, navigate]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = selectedState ? product.state === selectedState : true;

    const matchesStars = selectedStars ? product.rating === selectedStars : true;

    return matchesSearchTerm && matchesState && matchesStars;
  });

  // Dynamic colors based on theme toggle
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("black", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Flex>
      {/* Toggle Sidebar Button */}
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        position="fixed"
        top={10}
        left={10}
        zIndex={30}
        size="lg"
        colorScheme="blue"
      >
        {isSidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
      </Button>

      {/* Side Navbar */}
      <SideNavbar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedStars={selectedStars}
        setSelectedStars={setSelectedStars}
      />

      {/* Main Content */}
      <Container maxW="container.xl" py={20} mt={50}>
        <VStack spacing={8} align="start">
          {/* Search Bar */}
          <Flex justify="flex-start" w="full">
            <HStack spacing={3}>
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="filled"
                size="md"
                width={{ base: "200px", sm: "160px" }}
                bg={inputBg}
                borderColor={inputBorder}
                color={textColor}
                _placeholder={{ color: placeholderColor }}
              />
              {(searchTerm || selectedState || selectedStars) && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedState("");
                    setSelectedStars(null);
                  }}
                  colorScheme="gray"
                  aria-label="Clear search"
                >
                  <CloseIcon fontSize={12} />
                </Button>
              )}
            </HStack>
          </Flex>

          {/* Title */}
          <Flex justify="center" w="full">
            <Text
              fontSize="30"
              fontWeight="bold"
              bgGradient="linear(to-r, gray.700, gray.400)"
              bgClip="text"
              textAlign="center"
            >
              CURRENT TRAVEL - LOGS
            </Text>
          </Flex>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Flex w="full" justify="center">
              <VStack spacing={4} align="center" justify="center">
                <Text fontSize="xl" fontWeight="bold" color="gray.500" textAlign="center">
                  {searchTerm || selectedState || selectedStars
                    ? `No results for your filters 😢`
                    : "No Travel-logs found 😢"}
                </Text>
                <Link to="/create">
                  <Text
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                    textAlign="center"
                  >
                    Create a Travel-log
                  </Text>
                </Link>
              </VStack>
            </Flex>
          )}
        </VStack>
      </Container>
    </Flex>
  );
};

export default HomePage;