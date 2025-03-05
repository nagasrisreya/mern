import { Button, Container, Input, VStack, Text, useToast, HStack, Box, Center } from "@chakra-ui/react";
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and Password are required!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await login(email, password);

    if (!success) {
      toast({
        title: "Login Failed",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    navigate("/");
  };

  return (
    <Center h="100vh">
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={8} 
        boxShadow="lg" 
        maxW="sm" 
        width="full"
      >
        <VStack spacing={4}>
        <Text
          fontSize={{ base: "50px", sm: "30px" }}
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="left"
          bgGradient="linear(to-r, gray.700, gray.400)"
          bgClip="text"
        >
          TRAVEL LOG
        </Text>
          <Text fontSize="2xl" fontWeight="bold">LOGIN</Text>
          <Input 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password"
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <HStack spacing={4}>
            <Button onClick={handleLogin} colorScheme="blue">Login</Button>
            <Button onClick={() => navigate("/register")} colorScheme="gray">Register</Button>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;