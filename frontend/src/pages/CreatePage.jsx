import { useState } from "react";
import { 
  Box, Container, VStack, Heading, Input, Button, useColorModeValue, useToast 
} from "@chakra-ui/react";
import { useProductStore } from "../store/product.js";

const CreatePage = () => {
  const [newProduct, setNew] = useState({
    name: "",
    description: "",  
    image: "",
    state: "",
  });

  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    console.log("Payload being sent:", newProduct); // Log the payload
    const { success, message } = await createProduct(newProduct);
  
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });
  
    // Reset form after submission
    if (success) {
      setNew({ name: "", description: "", image: "", state: "" });
    }
  };
  

  return (
    <Container maxW="container.sm" mt={{ base: 20, md: 24 }} > {/* ✅ Added spacing */}
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center" mb={6}>
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
              type='string'
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