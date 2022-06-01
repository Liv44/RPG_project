import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { CharacterType } from "../../types/utils";

interface CardCharacterFightProps {
  character: CharacterType;
  isOpponent: boolean;
}

export const CardCharacterFight: FC<CardCharacterFightProps> = ({
  character,
  isOpponent,
}) => {
  return (
    <VStack>
      <Heading>{isOpponent ? "Vous" : "Adversaire"}</Heading>
      <VStack
        bg={isOpponent ? "pink" : "yellow"}
        width="100%"
        borderRadius={30}
        p="4"
        justifyContent="center"
      >
        <Heading size="md">{character.name}</Heading>
        <Text fontWeight="semibold">PV : {character.health}/100</Text>
        <Text fontWeight="light">Attaque : {character.attack}</Text>
        <Text fontWeight="light">Défense : {character.defense}</Text>
        <Text fontWeight="light">Magie : {character.magik}</Text>
      </VStack>
    </VStack>
  );
};
