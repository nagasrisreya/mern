import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  HStack,
  Input,
  Select,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";
import { useAuthStore } from "../store/auth";
import ProductCard from "../components/ProductCard";

const HomePage = ({ searchTerm, setSearchTerm, selectedState, setSelectedState }) => {
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
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesState = selectedState ? product.state === selectedState : true;
  
    return matchesSearchTerm && matchesState;
  });

  // Dynamic colors based on theme toggle
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("black", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="start">
        {/* Search & Filter in the Top Left */}
        <Flex justify="flex-start" w="full">
          <HStack spacing={3}>
            <Select
              placeholder="Filter by state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              variant="filled"
              size="md"
              width={{ base: "240px", sm: "150px" }}
              bg={inputBg}
              borderColor={inputBorder}
              color={textColor}
            >
              {/* State options */}
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </Select>
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
            {(searchTerm || selectedState) && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedState("");
                }}
                colorScheme="gray"
                aria-label="Clear search"
              >
                <CloseIcon fontSize={12} />
              </Button>
            )}
          </HStack>
        </Flex>

        {/* ✅ Centered Title */}
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
                {searchTerm || selectedState
                  ? `No results for "${searchTerm}" in ${selectedState || "any state"} 😢`
                  : "No Travel-logs found 😢"}
              </Text>
              <Link to="/create">
                <Text color="blue.500" _hover={{ textDecoration: "underline" }} textAlign="center">
                  Create a Travel-log
                </Text>
              </Link>
            </VStack>
          </Flex>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
