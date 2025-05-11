import React from "react";
import {
  Box,
  VStack,
  Text,
  Select,
  Checkbox,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const SideNavbar = ({
  isOpen, // New prop to control visibility
  onClose, // New prop to handle closing
  selectedState,
  setSelectedState,
  selectedStars,
  setSelectedStars,
}) => {
  // Dynamic colors based on theme toggle
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("black", "white");

  if (!isOpen) return null; // Hide the sidebar if not open

  return (
    <Box
      w="250px"
      h="100vh"
      bg={useColorModeValue("gray.100", "gray.800")}
      p={4}
      shadow="md"
      position="fixed"
      zIndex={20}
    >
      <VStack spacing={6} align="stretch">
        {/* Close Button */}
        <Button onClick={onClose} colorScheme="red" size="sm" alignSelf="flex-end">
          Close
        </Button>

        {/* State Filter */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Filter by State
          </Text>
          <Select
            placeholder="Select state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            variant="filled"
            size="md"
            bg={inputBg}
            borderColor={inputBorder}
            color={textColor}
          >
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
        </Box>

        {/* Star Filter */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Filter by Rating
          </Text>
          <VStack align="start">
            {[1, 2, 3, 4, 5].map((star) => (
              <Checkbox
                key={star}
                isChecked={selectedStars === star}
                onChange={() => setSelectedStars(selectedStars === star ? null : star)}
              >
                {star} Star{star > 1 ? "s" : ""}
              </Checkbox>
            ))}
          </VStack>
        </Box>

        {/* Clear Filters */}
        <Button
          onClick={() => {
            setSelectedState("");
            setSelectedStars(null);
          }}
          colorScheme="gray"
          w="full"
        >
          Clear Filters
        </Button>
      </VStack>
    </Box>
  );
};

export default SideNavbar;