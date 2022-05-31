import { PopoverContent, Text, Box } from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { CharacterType, FightType } from "../../types/utils";

interface PopupFightsProps {
  character: CharacterType;
}
export const PopupFights: FC<PopupFightsProps> = ({ character }) => {
  const [allFights, setAllFight] = useState<FightType[]>([]);
  useEffect(() => {
    axios.get("character/fights/" + character.ID).then((res) => {
      setAllFight(res.data.result);
    });
  }, []);

  return (
    <PopoverContent>
      <Box>
        {allFights.map((fight) => {
          return (
            <Text>
              {fight.fighter1} vs {fight.fighter2}
              {"-> Combat "}
              {(fight.fighter1 === character.name && fight.fighter1Won) ||
              (fight.fighter2 === character.name && !fight.fighter1Won)
                ? "gagné"
                : "perdu"}
            </Text>
          );
        })}
      </Box>
    </PopoverContent>
  );
};
