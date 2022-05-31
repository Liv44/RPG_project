import { Grid, Box } from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { CardCharacter } from "../components/home/CardCharacter";
// interface HomeProps {}
export const Home: FC = () => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    axios.get("/characters/1").then((res) => {
      if (res.data.success) {
        setAllCharacters(res.data.result);
      }
      console.log(res.data);
    });
  }, [changes]);

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={6} m={6} mt={10}>
      {allCharacters.map((character) => {
        return (
          <CardCharacter
            character={character}
            changesOnCharacter={() => setChanges(changes + 1)}
          />
        );
      })}
      {allCharacters.length !== 10 ? <Box>New One</Box> : <></>}
    </Grid>
  );
};
