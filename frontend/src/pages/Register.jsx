import { useState } from 'react';
import { 
  Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast({
        title: 'Error',
        description: 'All fields are required!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      toast({
        title: 'Registration successful!',
        description: 'You can now log in with your credentials.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Text
          fontSize={{ base: "50px", sm: "30px" }}
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
          bgGradient="linear(to-r, gray.700, gray.400)"
          bgClip="text"
        >
          TRAVEL LOG
        </Text>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Create an Account
      </Text>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="full"
          onClick={handleRegister}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Register
        </Button>
        <Text>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
            Login here
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;