import {
  Heading,
  Box,
  Grid,
  VStack,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { CardCharacterFight } from "../components/fight/CardCharacterFight";
import { CharacterType } from "../types/utils";
interface FightProps {
  character?: CharacterType;
}
export const Fight: FC = () => {
  const fighter1 = {
    name: "Loup Garou",
    rank: 1,
    ID: 1,
    skillPoints: 1,
    health: 1,
    attack: 1,
    defense: 1,
    magik: 1,
    dateLastFight: new Date(),
    statusLastFight: true,
    numberFights: 1,
  };
  const fighter2 = {
    name: "Grand mage",
    rank: 1,
    ID: 1,
    skillPoints: 1,
    health: 1,
    attack: 1,
    defense: 1,
    magik: 1,
    dateLastFight: new Date(),
    statusLastFight: true,
    numberFights: 1,
  };
  const [numberTurn, setNumberTurn] = useState(0);
  const [attackPoints, setAttackPoints] = useState(6);

  return (
    <VStack m={5}>
      <HStack gap={20} alignItems="start">
        <CardCharacterFight
          character={fighter1}
          isOpponent={false}
        ></CardCharacterFight>
        <VStack>
          <Heading textAlign="center">Tour {numberTurn}</Heading>
          <Text textAlign="center">Force de l'attaque : {attackPoints}/10</Text>
          <Button bg="blue" color="white">
            Lancer le dé
          </Button>
        </VStack>
        <CardCharacterFight
          character={fighter2}
          isOpponent={true}
        ></CardCharacterFight>
      </HStack>
      <Box
        display="flex"
        bg="blue"
        color="white"
        borderRadius={30}
        minWidth={600}
        minHeight={100}
        alignItems="center"
        justifyContent="center"
      >
        <Text>C'est à X de jouer. </Text>
      </Box>
    </VStack>
  );
};
