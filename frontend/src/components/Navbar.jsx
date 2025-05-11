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
  IconButton,
} from "@chakra-ui/react";
import { PlusSquareIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaMapMarkedAlt } from "react-icons/fa"; // ✅ Travel icon
import { useAuthStore } from "../store/auth";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuthStore();
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Container
        maxW="1250px"
        px={4}
        py={7}
        position="fixed"
        top={5}
        left="9%"
        zIndex={10}
        bg={useColorModeValue("white", "gray.800")}
        shadow="md"
        borderRadius="md"
        width="100%"
        mt={{ base: "0", md: "0" }}
      >
        <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
          {/* Left Side Placeholder */}
          <Flex flex="1" />

          {/* ✅ Centered Logo with Icon */}
          <Flex flex="1" justify="center" align="center">
            <Link to="/" aria-label="Home">
              <Flex align="center">
                <FaMapMarkedAlt size={35} style={{ marginRight: "8px" }} />
                <Text
                  fontSize={{ base: "30px", sm: "40px" }}
                  fontWeight="bold"
                  textTransform="uppercase"
                  bgGradient="linear(to-r, gray.700, gray.400)"
                  bgClip="text"
                  textAlign="center"
                >
                    TRAVEL LOG
                </Text>
              </Flex>
            </Link>
          </Flex>

          {/* Right Side Buttons */}
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
              {user ? (
                <Menu>
                  <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                    <Avatar size="md" name={user.email} />
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
              ) : (
                <Link to="/login">
                  <Button colorScheme="blue">Login</Button>
                </Link>
              )}
            </HStack>
          </Flex>
        </Flex>
      </Container>

      {/* Scroll-to-Top Button */}
      {showScrollButton && (
        <IconButton
          icon={<ChevronUpIcon />}
          onClick={handleScrollToTop}
          position="fixed"
          bottom={20}
          size="lg"
          right={10}
          colorScheme="blue"
          aria-label="Scroll to top"
          zIndex={20}
          isRound
        />
      )}
    </>
  );
};

export default Navbar;
