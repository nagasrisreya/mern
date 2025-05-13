import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  useColorModeValue,
  Avatar,
  Flex,
  IconButton,
  SlideFade,
  useToast,
  Badge,
  HStack,
  CloseButton,
  Collapse
} from "@chakra-ui/react";
import { FiSend, FiUser, FiMessageSquare, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Controls whether the chat is open or closed
  const messagesEndRef = useRef(null);
  const toast = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Message cannot be empty",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newMessages = [
      ...messages,
      { 
        role: "user", 
        text: userInput, 
        timestamp: new Date()
      },
    ];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: userInput,
      });

      const botReply = response.data.reply || "I couldn't understand that.";
      setMessages([
        ...newMessages,
        { 
          role: "bot", 
          text: botReply, 
          timestamp: new Date()
        },
      ]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages([
        ...newMessages,
        {
          role: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeString = (date) => {
    if (!date || !(date instanceof Date)) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Box position="fixed" bottom="4" right="4">
        <Button 
          leftIcon={<FiMessageSquare />} 
          colorScheme="blue" 
          onClick={() => setIsOpen(true)}
          boxShadow="lg"
        >
          travel bot
        </Button>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      w="full"
      maxW="600px"
      mx="auto"
      borderRadius="xl"
      boxShadow="2xl"
      bg={useColorModeValue("white", "gray.800")}
      overflow="hidden"
      zIndex="modal"
    >
      {/* Header with controls */}
      <Flex
        p={4}
        bg={useColorModeValue("blue.500", "blue.600")}
        color="white"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <Avatar
            icon={<FiMessageSquare />}
            bg={useColorModeValue("blue.400", "blue.300")}
            mr={3}
          />
          <Box>
            <Text fontWeight="bold">Travel Assistant</Text>
            <Text fontSize="sm" opacity={0.8}>
              Powered by Travel-log
            </Text>
          </Box>
        </Flex>
        
        <HStack spacing={2}>
          <Badge colorScheme="green" variant="solid">
            Online
          </Badge>
          <IconButton
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            icon={isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            onClick={toggleMinimize}
            size="sm"
          />
          <CloseButton 
            color="white" 
            _hover={{ bg: "rgba(255,255,255,0.2)" }} 
            onClick={handleClose}
            size="sm"
          />
        </HStack>
      </Flex>

      <Collapse in={!isMinimized} animateOpacity>
        {/* Messages area */}
        <Box
          h="500px"
          p={4}
          overflowY="auto"
          bg={useColorModeValue("gray.50", "gray.700")}
        >
          {messages.map((msg, idx) => (
            <SlideFade in={true} offsetY="20px" key={idx}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                mb={4}
                alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
              >
                <Flex
                  direction={msg.role === "user" ? "row-reverse" : "row"}
                  align="flex-start"
                  gap={3}
                >
                  <Avatar
                    size="sm"
                    icon={msg.role === "user" ? <FiUser /> : <FiMessageSquare />}
                    bg={
                      msg.role === "user"
                        ? useColorModeValue("blue.400", "blue.300")
                        : useColorModeValue("gray.400", "gray.500")
                    }
                  />
                  <Box
                    maxW="80%"
                    p={3}
                    borderRadius="lg"
                    bg={
                      msg.role === "user"
                        ? useColorModeValue("blue.500", "blue.400")
                        : useColorModeValue("white", "gray.600")
                    }
                    color={
                      msg.role === "user"
                        ? "white"
                        : useColorModeValue("gray.800", "white")
                    }
                    boxShadow="md"
                    position="relative"
                  >
                    <Text>{msg.text}</Text>
                    {msg.timestamp && (
                      <Text
                        fontSize="xs"
                        opacity={0.7}
                        textAlign={msg.role === "user" ? "left" : "right"}
                        mt={1}
                      >
                        {getTimeString(msg.timestamp)}
                      </Text>
                    )}
                  </Box>
                </Flex>
              </MotionBox>
            </SlideFade>
          ))}
          {isLoading && (
            <Flex align="flex-start" gap={3}>
              <Avatar
                size="sm"
                icon={<FiMessageSquare />}
                bg={useColorModeValue("gray.400", "gray.500")}
              />
              <Box
                maxW="80%"
                p={3}
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.600")}
                boxShadow="md"
              >
                <Flex gap={2}>
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="gray.400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="gray.400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  />
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="gray.400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                  />
                </Flex>
              </Box>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input area */}
        <Box p={4} bg={useColorModeValue("white", "gray.700")} borderTopWidth="1px">
          <InputGroup>
            <Input
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              pr="4.5rem"
              borderRadius="full"
              bg={useColorModeValue("gray.100", "gray.600")}
              border="none"
              _focus={{
                boxShadow: "outline",
                bg: useColorModeValue("white", "gray.600"),
              }}
            />
            <InputRightElement width="4.5rem">
              <IconButton
                h="1.75rem"
                size="sm"
                borderRadius="full"
                colorScheme="blue"
                aria-label="Send message"
                icon={<FiSend />}
                onClick={sendMessage}
                isLoading={isLoading}
                isDisabled={!userInput.trim()}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChatBot;