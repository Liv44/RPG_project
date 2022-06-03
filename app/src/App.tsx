import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fight } from "./pages/Fight";

import { Home } from "./pages/Home";

function App() {
  return (
    <Box backgroundColor="background" minHeight="100vh">
      <HStack
        padding="3"
        color="white"
        backgroundColor="blue"
        justifyContent="space-between"
      >
        <Heading>RPG theTribe</Heading>
        <HStack>
          <Text>Connecté en tant que : "nom de l'utilisateur"</Text>
          <Button backgroundColor="yellow"> Déconnexion</Button>
        </HStack>
      </HStack>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/fight" element={<Fight />}></Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
