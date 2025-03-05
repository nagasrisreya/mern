import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/product";
import { useAuthStore } from "../store/auth";
import ProductCard from "../components/ProductCard";

const HomePage = ({ searchTerm, selectedState }) => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [user, fetchProducts, navigate]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState ? product.state === selectedState : true;

    return matchesSearchTerm && matchesState;
  });

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text fontSize="30" fontWeight="bold" bgGradient="linear(to-r, gray.700,gray.400)" bgClip="text" textAlign="center">
          CURRENT TRAVEL - LOGS
        </Text>

        {filteredProducts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={4}>
            <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
              {searchTerm || selectedState
                ? `No results for "${searchTerm}" in ${selectedState || "any state"} 😢`
                : "No Travel-logs found 😢"}
            </Text>
            <Link to="/create">
              <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
                Create a Travel-log
              </Text>
            </Link>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
