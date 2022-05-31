import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import React, { FC, useState } from "react";

interface StatsProps {
  stat: string;
  value: number;
  changeSkillPoints: (x: number) => void;
  remainingSkillPoints: number;
  sendPointsAdded: (x: number) => void;
}
export const Stats: FC<StatsProps> = ({
  stat,
  value,
  changeSkillPoints,
  remainingSkillPoints,
  sendPointsAdded,
}) => {
  const [valueSkillPointAdded, setValueSkillPointAdded] = useState(0);
  const addSkillPoint = () => {
    setValueSkillPointAdded(valueSkillPointAdded + 1);
    changeSkillPoints(1);
    sendPointsAdded(valueSkillPointAdded);
  };
  const lowerSkillPoint = () => {
    setValueSkillPointAdded(valueSkillPointAdded - 1);
    changeSkillPoints(-1);
    sendPointsAdded(valueSkillPointAdded - 1);
  };
  return (
    <HStack justifyContent="space-between">
      <Text>
        {stat} : {value + valueSkillPointAdded}
      </Text>
      <HStack justifyContent="flex-end">
        <IconButton
          aria-label="plus-icon"
          size="sm"
          icon={<MinusIcon />}
          onClick={() => {
            valueSkillPointAdded === 0
              ? setValueSkillPointAdded(valueSkillPointAdded)
              : lowerSkillPoint();
          }}
        ></IconButton>
        <Text>{valueSkillPointAdded}</Text>
        <IconButton
          aria-label="plus-icon"
          size="sm"
          icon={<AddIcon />}
          onClick={() => {
            remainingSkillPoints === 0
              ? setValueSkillPointAdded(valueSkillPointAdded)
              : addSkillPoint();
          }}
        ></IconButton>
      </HStack>
    </HStack>
  );
};
