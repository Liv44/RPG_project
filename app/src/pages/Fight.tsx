import { Heading, Box, VStack, Button, Text, HStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { CardCharacterFight } from "../components/fight/CardCharacterFight";
import { CharacterType } from "../types/utils";
import axios from "axios";
import { ModalEndFight } from "../components/fight/ModalEndFight";

export const Fight: FC = () => {
  const [fighter1, setFighter1] = useState<CharacterType>();
  const [fighter2, setFighter2] = useState<CharacterType>();
  const [currentHealthFighter1, setCurrentHealthFighter1] = useState(0);
  const [currentHealthFighter2, setCurrentHealthFighter2] = useState(0);
  const [message, setMessage] = useState("Début du combat.");
  const [numberTurn, setNumberTurn] = useState(1);
  const [attackPoints, setAttackPoints] = useState(0);
  const [activeButton, setActiveButton] = useState(true);
  const [currentFighterAttack, setCurrentFighterAttack] = useState(0);
  const [isEndOfFight, setIsEndOfFight] = useState(false);
  const [endMessage, setEndMessage] = useState("");

  useEffect(() => {
    //get fighters infos
    axios.get("/fight/loadingFighters").then((res) => {
      if (res.data.fighter1 === undefined || res.data.fighter2 === undefined) {
        window.location.href = "/";
      } else {
        setFighter1(res.data.fighter1);
        setFighter2(res.data.fighter2);
        setCurrentHealthFighter1(res.data.fighter1.health);
        setCurrentHealthFighter2(res.data.fighter2.health);
      }
    });
  }, []);

  const rollingDice = (
    currentHealthPassive: number,
    isUserConnectedTurn: boolean,
    Attacking?: CharacterType,
    Passive?: CharacterType
  ) => {
    setActiveButton(false);
    if (Attacking !== undefined) {
      setCurrentFighterAttack(Attacking.attack);
    }
    axios
      .post("/fighting", {
        Attacking: Attacking,
        Passive: Passive,
        healthPassive: currentHealthPassive,
      })
      .then((res) => {
        // Get the result of the fight
        const result = res.data.result;
        setAttackPoints(result.attackPoints);

        isUserConnectedTurn
          ? setCurrentHealthFighter2(
              currentHealthFighter2 - result.healthPointsRemoved
            )
          : setCurrentHealthFighter1(
              currentHealthFighter1 - result.healthPointsRemoved
            );

        setMessage(result.message);
        //Vérification si quelqu'un a perdu/gagné
        if (result.winner !== "") {
          if (Attacking !== undefined && Passive !== undefined) {
            axios
              .post("/fight/new", {
                fighter1ID: Attacking.ID,
                fighter2ID: Passive.ID,
                winnerID: Attacking.ID,
              })
              .then((res) => {});
          }
          setTimeout(() => {
            setIsEndOfFight(true);
            isUserConnectedTurn
              ? setEndMessage("Vous avez gagné.")
              : setEndMessage("Vous avez perdu.");
          }, 1500);
        } else if (result.winner === "" && isUserConnectedTurn) {
          setTimeout(() => {
            setMessage("C'est à l'adversaire de jouer.");
          }, 5000);
          setTimeout(() => {
            rollingDice(currentHealthFighter2, false, fighter2, fighter1);
          }, 7000);
        } else if (result.winner === "" && !isUserConnectedTurn) {
          setTimeout(() => {
            setActiveButton(true);
            setMessage("C'est à vous de jouer.");
            setNumberTurn(numberTurn + 1);
          }, 5000);
        }
      });
  };

  const lauchTurn = () => {
    // recursive function to launch attack 2 times.
    rollingDice(currentHealthFighter2, true, fighter1, fighter2);
  };
  if (fighter1 && fighter2) {
    return (
      <VStack m={5}>
        <VStack>
          <HStack gap={20} alignItems="start">
            <CardCharacterFight
              currentHealth={currentHealthFighter1}
              character={fighter1}
              isOpponent={false}
            ></CardCharacterFight>
            <VStack>
              <Heading textAlign="center">Tour {numberTurn}</Heading>
              <Text textAlign="center">
                Force de l'attaque : {attackPoints}/{currentFighterAttack}
              </Text>
              <Button
                bg="blue"
                color="white"
                onClick={() => lauchTurn()}
                disabled={!activeButton}
                _hover={{
                  bg: activeButton ? "yellow" : "blue",
                  color: "white",
                }}
              >
                Lancer le dé
              </Button>
            </VStack>
            <CardCharacterFight
              currentHealth={currentHealthFighter2}
              character={fighter2}
              isOpponent={true}
            ></CardCharacterFight>
          </HStack>
          <Box
            display="flex"
            bg="blue"
            color="white"
            borderRadius={30}
            width={600}
            p={5}
            minHeight={100}
            alignItems="center"
            justifyContent="center"
          >
            <Text noOfLines={2} textAlign="center">
              {message}
            </Text>
          </Box>

          <ModalEndFight
            isOpen={isEndOfFight}
            message={endMessage}
          ></ModalEndFight>
        </VStack>
        <Button
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Arrêter le combat.
        </Button>
      </VStack>
    );
  }
  return <></>;
};
