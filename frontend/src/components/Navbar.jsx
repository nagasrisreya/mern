import {
  Container,
  Flex,
  Text,
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useAuthStore } from "../store/auth";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
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
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        {/* Left Side Placeholder to Balance Flexbox Layout */}
        <Flex flex="1" />

        {/* ✅ Centered Logo */}
        <Flex flex="1" justify="center">
          <Text
            fontSize={{ base: "30px", sm: "40px" }}
            fontWeight="bold"
            textTransform="uppercase"
            bgGradient="linear(to-r, gray.700, gray.400)"
            bgClip="text"
            textAlign="center"
          >
            <Link to="/" aria-label="Home">TRAVEL LOG</Link>
          </Text>
        </Flex>

        {/* Navigation Buttons - Right Side */}
        <Flex flex="1" justify="flex-end">
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
            {/* Profile Menu */}
            {user && (
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                  <Avatar size="md" name={user.email} /> {/* Increased size to "md" */}
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Button
                      colorScheme="red"
                      w="full"
                      onClick={handleLogout}
                      aria-label="Logout"
                    >
                      Logout
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
            {!user && (
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