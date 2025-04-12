import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState, useRef } from "react";

const ProductCard = ({ product, searchTerm }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isTravelOpen,
    onOpen: onTravelOpen,
    onClose: onTravelClose,
  } = useDisclosure();

  const cancelRef = useRef();
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();

  const [currentLocation, setCurrentLocation] = useState("");
  const [transportOptions, setTransportOptions] = useState([]);
  const [placesToVisit, setPlacesToVisit] = useState([]);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const handleDeleteProduct = async (pid) => {
    setIsDeleteLoading(true);
    const { success, message } = await deleteProduct(pid);
    setIsDeleteLoading(false);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    if (success) {
      onDeleteClose();
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    setLoading(true);
    const { success, message } = await updateProduct(pid, updatedProduct);
    setLoading(false);
    onClose();

    toast({
      title: success ? "Success" : "Error",
      description: success ? "Travel Log updated successfully" : message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };
  const handleFetchDetails = async () => {
    if (!currentLocation) {
      toast({
        title: "Error",
        description: "Please enter your current location.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const response = await fetch(`/api/v1/location/distance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: currentLocation,
          to: product.name,
        }),
      });
  
      const data = await response.json();
  
      console.log("API Response:", data); // Log the API response
      console.log("Places to visit:", data.placesToVisit); // Log the current location
      if (data.success) {
        setDistance(data.distance);
        setTime(data.time);
        setTransportOptions(data.transportOptions || []);
        setPlacesToVisit(data.placesToVisit || ["kkkk"]);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching details:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (
    searchTerm &&
    !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) {
    return null;
  }

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
      cursor="pointer"
      onClick={onTravelOpen}
    >
      <Image src={product.image} alt={product.name} h={48} w="full" objectFit="cover" />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="lg" color={textColor} mb={4}>
          {product.description}
        </Text>

        <HStack spacing={3} onClick={(e) => e.stopPropagation()}>
          <IconButton
            icon={<EditIcon />}
            onClick={onOpen}
            colorScheme="blue"
            aria-label="Edit product"
          />
          <IconButton
            icon={isDeleteLoading ? <Spinner size="xs" /> : <DeleteIcon />}
            onClick={onDeleteOpen}
            colorScheme="red"
            aria-label="Delete product"
            isDisabled={isDeleteLoading}
          />
        </HStack>
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Travel Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                value={updatedProduct.name}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={updatedProduct.description}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, description: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                value={updatedProduct.image}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
              />
              <Input
                placeholder="Place State"
                value={updatedProduct.state}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, state: e.target.value })}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
              isLoading={loading}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Travel Log
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this travel log? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteProduct(product._id)}
                ml={3}
                isLoading={isDeleteLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Travel Details Modal */}
      <Modal isOpen={isTravelOpen} onClose={onTravelClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Travel to {product.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Do you want to travel to {product.name}? Enter your current location to proceed.
            </Text>
            <Input
              placeholder="Enter your current location"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              mb={3}
            />
            <Button colorScheme="blue" onClick={handleFetchDetails} w="full" mb={4}>
              Fetch Details
            </Button>

            {distance && (
              <Text>
                <strong>Distance:</strong> {distance} | <strong>Estimated Time:</strong> {time}
              </Text>
            )}

            {transportOptions.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>
                  Available Transportation:
                </Text>
                <Wrap>
                  {transportOptions.map((option, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="blue" variant="subtle">
                        <TagLabel>{option}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
            {Array.isArray(placesToVisit) && placesToVisit.length > 0 && (
  <Box mt={4}>
    <Text fontWeight="bold" mb={2}>
      Top Places to Visit:
    </Text>
    <Wrap>
      {placesToVisit.map((place, index) => (
        <WrapItem key={index}>
          <Tag size="md" colorScheme="green" variant="subtle">
            <TagLabel>{place}</TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  </Box>
)}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onTravelClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
