import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Ensure fetchProducts is stable

  console.log("products", products);

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text
          fontSize="30"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >
          Current Travel - Logs 
        </Text>

        {products.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={4}>
            <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
              No Travel-logs found 😢
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
