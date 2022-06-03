import { Grid, Box } from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { CardCharacter } from "../components/home/CardCharacter";
import { NewCharacter } from "../components/home/NewCharacter";
// interface HomeProps {}
export const Home: FC = () => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    axios.get("/characters/1").then((res) => {
      if (res.data.success) {
        setAllCharacters(res.data.result);
      }
    });
  }, [changes]);

  return (
    <Grid
      templateColumns="repeat(5, minmax(0, 1fr))"
      justifyItems="center"
      gap={6}
      m={6}
      mt={10}
    >
      {allCharacters.map((character) => {
        return (
          <CardCharacter
            character={character}
            changesOnCharacter={() => setChanges(changes + 1)}
          />
        );
      })}
      {allCharacters.length !== 10 ? (
        <NewCharacter
          changesOnCharacter={() => setChanges(changes + 1)}
        ></NewCharacter>
      ) : (
        <></>
      )}
    </Grid>
  );
};
