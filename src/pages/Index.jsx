import React, { useState } from "react";
import { Box, Input, Button, Text, Flex, Spacer, VStack, HStack, IconButton, Avatar, Divider, Heading, Link, useColorMode } from "@chakra-ui/react";
import { FaSearch, FaBookmark, FaUser, FaMoon, FaSun } from "react-icons/fa";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  const handleSearch = () => {
    // Simulated search results
    const dummyResults = [
      {
        title: "Result 1",
        description: "This is the first search result.",
        url: "https://example.com/result1",
      },
      {
        title: "Result 2",
        description: "This is the second search result.",
        url: "https://example.com/result2",
      },
      // Add more dummy results as needed
    ];
    setResults(dummyResults);
  };

  const handleChatSend = async () => {
    if (chatInput.trim() !== "") {
      const userMessage = { text: chatInput, isUser: true };
      setChatMessages([...chatMessages, userMessage]);
      setChatInput("");

      try {
        const response = await fetch("http://localhost:3001/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: chatInput }),
        });

        const data = await response.json();
        const botMessage = { text: data.message, isUser: false };
        setChatMessages([...chatMessages, userMessage, botMessage]);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Box>
      <Flex align="center" p={4} bg={colorMode === "light" ? "gray.100" : "gray.900"}>
        <Box>
          <Heading size="lg">AI Web Search</Heading>
        </Box>
        <Spacer />
        <HStack spacing={4}>
          <IconButton icon={<FaBookmark />} aria-label="Bookmarks" variant="ghost" />
          <IconButton icon={<FaUser />} aria-label="Profile" variant="ghost" />
          <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} aria-label="Toggle theme" onClick={toggleColorMode} variant="ghost" />
        </HStack>
      </Flex>
      <Flex p={4}>
        <Box flex={2} mr={4}>
          <Flex mb={4}>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." mr={2} />
            <Button leftIcon={<FaSearch />} onClick={handleSearch}>
              Search
            </Button>
          </Flex>
          <VStack align="stretch" spacing={4}>
            {results.map((result, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="md">
                <Link href={result.url} isExternal>
                  <Heading size="md">{result.title}</Heading>
                </Link>
                <Text mt={2}>{result.description}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box flex={1} bg={colorMode === "light" ? "gray.100" : "gray.900"} p={4} borderRadius="md">
          <VStack align="stretch" spacing={4}>
            {chatMessages.map((message, index) => (
              <Flex key={index} justify={message.isUser ? "flex-end" : "flex-start"}>
                {!message.isUser && <Avatar size="sm" mr={2} />}
                <Box p={2} borderRadius="md" bg={message.isUser ? "blue.500" : "gray.200"} color={message.isUser ? "white" : "black"}>
                  {message.text}
                </Box>
              </Flex>
            ))}
          </VStack>
          <Divider my={4} />
          <Flex>
            <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." mr={2} />
            <Button onClick={handleChatSend}>Send</Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Index;
