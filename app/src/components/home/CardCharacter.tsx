import { Box, Button, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { CharacterType } from "../../types/utils";
import { CardChangeStatsCharacter } from "./CardChangeStatsCharacter";

interface CardCharacterProps {
  character: CharacterType;
  changesOnCharacter: () => void;
}
export const CardCharacter: FC<CardCharacterProps> = ({
  character,
  changesOnCharacter,
}) => {
  const [isChangingStats, setIsChangingStats] = useState(false);

  const CardDetails = () => {
    return (
      <Box
        flexDirection="row"
        border="4px"
        borderRadius={30}
        borderColor="yellow"
        p={4}
      >
        <Heading textAlign="center" size="md">
          {character.name}
        </Heading>
        <Divider backgroundColor="blue"></Divider>
        <Text>Rank {character.rank}</Text>
        <Text>Points de compétences {character.skillPoints}</Text>
        <Box mb={5}>
          <Text>PV : {character.health}</Text>
          <Text>Attaque : {character.attack}</Text>
          <Text>Défense : {character.defense}</Text>
          <Text>Magie : {character.magik}</Text>
        </Box>
        <VStack>
          <Button
            size="sm"
            backgroundColor="pink"
            onClick={() => {
              setIsChangingStats(true);
            }}
          >
            Distribuer les compétences
          </Button>
          <Button size="sm" backgroundColor="pink">
            Voir les derniers combats
          </Button>
          <Button backgroundColor="blue" color="white">
            Lancer un combat
          </Button>
        </VStack>
      </Box>
    );
  };
  if (isChangingStats) {
    return (
      <CardChangeStatsCharacter
        character={character}
        clicked={() => {
          setIsChangingStats(false);
          changesOnCharacter();
        }}
      />
    );
  } else {
    return <CardDetails />;
  }
};
