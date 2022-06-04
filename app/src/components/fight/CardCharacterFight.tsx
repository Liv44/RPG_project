import { Heading, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { CharacterType } from "../../types/utils";

interface CardCharacterFightProps {
  character: CharacterType;
  isOpponent: boolean;
  currentHealth: number;
}

export const CardCharacterFight: FC<CardCharacterFightProps> = ({
  character,
  isOpponent,
  currentHealth,
}) => {
  return (
    <VStack>
      <Heading>{isOpponent ? "Adversaire" : "Vous"}</Heading>
      <VStack
        bg={isOpponent ? "pink" : "yellow"}
        width="200px"
        borderRadius={30}
        p="4"
        justifyContent="center"
      >
        <Heading size="md">{character.name}</Heading>
        <Text fontWeight="semibold">
          PV : {currentHealth}/{character.health}
        </Text>
        <Text fontWeight="light">Attaque : {character.attack}</Text>
        <Text fontWeight="light">Défense : {character.defense}</Text>
        <Text fontWeight="light">Magie : {character.magik}</Text>
      </VStack>
    </VStack>
  );
};
