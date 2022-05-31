import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useState } from "react";
import { CharacterType } from "../../types/utils";
import { Stats } from "./Stats";

interface CardCharacterProps {
  character: CharacterType;
  clicked: () => void;
}
interface newStats {
  name: string;
  health: number;
  attack: number;
  defense: number;
  magik: number;
}
export const CardChangeStatsCharacter: FC<CardCharacterProps> = ({
  character,
  clicked,
}) => {
  const [remainingSkillPoints, setRemainingSkillPoints] = useState(
    character.skillPoints
  );
  const [newStatCharacter, setnewStatCharacter] = useState({
    name: character.name,
    health: 0,
    attack: 0,
    defense: 0,
    magik: 0,
  } as newStats);

  const validateChanges = () => {
    axios
      .put("/character/edit/" + character.ID, newStatCharacter)
      .then((res) => {
        console.log(res.data);
        console.log(newStatCharacter);
        clicked();
      });
  };
  return (
    <Box
      flexDirection="row"
      border="4px"
      borderRadius={30}
      borderColor="pink"
      p={4}
    >
      <Heading textAlign="center" size="md">
        {character.name}
      </Heading>
      <Divider backgroundColor="blue"></Divider>
      <Text>Rank {character.rank}</Text>
      <Text>Points de compétences restants {remainingSkillPoints}</Text>
      <Box mb={5}>
        <Text>PV : {character.health}</Text>
        {/* changement des différents stats du character */}
        <Stats
          stat="PV"
          value={character.health}
          changeSkillPoints={(x) =>
            setRemainingSkillPoints(remainingSkillPoints - x)
          }
          remainingSkillPoints={remainingSkillPoints}
          sendPointsAdded={(x) =>
            setnewStatCharacter({
              name: character.name,
              health: x,
              attack: newStatCharacter.attack,
              defense: newStatCharacter.defense,
              magik: newStatCharacter.magik,
            })
          }
        ></Stats>
        <Stats
          stat="Attaque"
          value={character.attack}
          changeSkillPoints={(x) =>
            setRemainingSkillPoints(remainingSkillPoints - x)
          }
          remainingSkillPoints={remainingSkillPoints}
          sendPointsAdded={(x) =>
            setnewStatCharacter({
              name: character.name,
              health: newStatCharacter.health,
              attack: x,
              defense: newStatCharacter.defense,
              magik: newStatCharacter.magik,
            })
          }
        ></Stats>
        <Stats
          stat="Défense"
          value={character.defense}
          changeSkillPoints={(x) =>
            setRemainingSkillPoints(remainingSkillPoints - x)
          }
          remainingSkillPoints={remainingSkillPoints}
          sendPointsAdded={(x) =>
            setnewStatCharacter({
              name: character.name,
              health: newStatCharacter.health,
              attack: newStatCharacter.attack,
              defense: x,
              magik: newStatCharacter.magik,
            })
          }
        ></Stats>
        <Stats
          stat="Magie"
          value={character.magik}
          changeSkillPoints={(x) =>
            setRemainingSkillPoints(remainingSkillPoints - x)
          }
          remainingSkillPoints={remainingSkillPoints}
          sendPointsAdded={(x) =>
            setnewStatCharacter({
              name: character.name,
              health: newStatCharacter.health,
              attack: newStatCharacter.attack,
              defense: newStatCharacter.defense,
              magik: x,
            })
          }
        ></Stats>
      </Box>
      <Button onClick={validateChanges}>Valider</Button>
    </Box>
  );
};
