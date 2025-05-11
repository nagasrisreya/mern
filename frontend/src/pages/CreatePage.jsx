import { useState } from "react";
import { 
  Box, Container, VStack, Heading, Input, Button, useColorModeValue, useToast, HStack, Text 
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa"; // Import star icons
import { useProductStore } from "../store/product.js";

const CreatePage = () => {
  const [newProduct, setNew] = useState({
    name: "",
    description: "",
    image: "",
    state: "",
    rating: 0, // Add rating field
  });

  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.image || !newProduct.state) {
      toast({
        title: "Error",
        description: "All fields are required!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await createProduct(newProduct);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      setNew({ name: "", description: "", image: "", state: "", rating: 0 });
    }
  };

  return (
    <Container maxW="container.sm" mt={{ base: 20, md: 24 }}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center" mb={6} mt={10}>
  Create New Travel-Log
</Heading>
        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={5}>
            <Input
              placeholder="Place Name"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNew({ ...newProduct, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              name="description"
              value={newProduct.description}
              onChange={(e) => setNew({ ...newProduct, description: e.target.value })}
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) => setNew({ ...newProduct, image: e.target.value })}
            />
            <Input
              placeholder="State of the place"
              name="state"
              value={newProduct.state}
              onChange={(e) => setNew({ ...newProduct, state: e.target.value })}
            />
            <HStack>
              <Text>RATING (how much do you rate this place out of 5) </Text>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box
                  key={star}
                  as="button"
                  onClick={() => setNew({ ...newProduct, rating: star })}
                >
                  <FaStar
                    size={20}
                    color={star <= newProduct.rating ? "gold" : "gray"}
                  />
                </Box>
              ))}
            </HStack>
            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Travel-Log
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;