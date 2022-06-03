import {
  Box,
  Button,
  Divider,
  Popover,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { CharacterType } from "../../types/utils";
import { CardChangeStatsCharacter } from "./CardChangeStatsCharacter";
import { HeadingCard } from "./HeadingCard";
import { PopupFights } from "./PopupFights";
import axios from "axios";

interface CardCharacterProps {
  character: CharacterType;
  changesOnCharacter: () => void;
}
export const CardCharacter: FC<CardCharacterProps> = ({
  character,
  changesOnCharacter,
}) => {
  const [isChangingStats, setIsChangingStats] = useState(false);
  const handleClick = () => {
    axios
      .get("/fight/selectFighter/" + character.ID + "/" + character.userID)
      .then((res) => {
        if (res.data.error === null) {
          window.location.href = "/fight";
        } else {
          alert("Il y a eu un problème.");
        }
      });
  };
  const CardDetails = () => {
    return (
      <Box
        flexDirection="row"
        bg="white"
        boxShadow="sm"
        border="4px"
        borderRadius={30}
        borderColor="yellow"
        p={4}
      >
        <HeadingCard
          rank={character.rank}
          name={character.name}
          ID={character.ID}
          changesOnCharacter={changesOnCharacter}
        ></HeadingCard>
        <Divider mb={5}></Divider>
        <Text textAlign="center" fontWeight="light">
          Points de compétences restants
        </Text>
        <Text textAlign="center" fontWeight="extrabold">
          {character.skillPoints}
        </Text>
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
          <Popover>
            <PopoverTrigger>
              <Button size="sm" backgroundColor="pink">
                Voir les derniers combats
              </Button>
            </PopoverTrigger>
            <PopupFights character={character} />
          </Popover>
          <Button
            backgroundColor="blue"
            color="white"
            onClick={() => {
              handleClick();
            }}
          >
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
