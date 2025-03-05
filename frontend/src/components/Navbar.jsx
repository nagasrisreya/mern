import {
  Container,
  Flex,
  Text,
  HStack,
  Button,
  Input,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { PlusSquareIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useAuthStore } from "../store/auth"; // Import auth store

const Navbar = ({ searchTerm, setSearchTerm, selectedState, setSelectedState }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuthStore(); // Get user and logout from auth store

  const handleLogout = () => {
    logout();
    setSearchTerm("");
    setSelectedState("");
  };

  return (
    <Container
      maxW="1250px"
      px={4}
      py={7}
      position="sticky"
      top={10}
      zIndex={10}
      bg={useColorModeValue("white", "gray.800")}
      shadow="md"
      borderRadius="md"
    >
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4}>
        
        {/* Search & Filter (Side by Side) */}
        <Flex flex="3" justify={{ base: "center", md: "flex-start" }}>
          <HStack spacing={3} flexWrap="nowrap">
            <Select
              placeholder="Filter by state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              variant="filled"
              size="md"
              width={{ base: "240px", sm: "150px" }}
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
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="filled"
              size="md"
              width={{ base: "200px", sm: "160px" }}
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

        {/* Centered Logo */}
        <Flex flex="15" justify="left">
        <Text
          mx="160px"
          fontSize={{ base: "30px", sm: "40px" }}
          fontWeight="bold"
          textTransform="uppercase"
          bgGradient="linear(to-r, gray.700, gray.400)"
          bgClip="text"
          >
            <Link to="/" aria-label="Home">TRAVEL LOG</Link>
          </Text>
        </Flex>

        {/* Navigation Buttons - Aligned Right */}
        <Flex flex="1" justify={{ base: "center", md: "flex-end" }}>
          <HStack spacing={3}>
            <Link to="/create" aria-label="Create new entry">
              <Button colorScheme="gray">
                <PlusSquareIcon fontSize={20} />
              </Button>
            </Link>
            {/* Theme Toggle */}
            <Button onClick={toggleColorMode} aria-label="Toggle color mode">
              {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
            </Button>
            {/* Login / Logout */}
            {user ? (
              <Button onClick={handleLogout} colorScheme="red">
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button colorScheme="blue">Login</Button>
              </Link>
            )}
          </HStack>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Navbar;
