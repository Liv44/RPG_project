import {
  Box,
  Text,
  Input,
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalBody,
} from "@chakra-ui/react";
import axios from "axios";
import { FC, useState } from "react";

interface NewCharacterProps {
  changesOnCharacter: () => void;
}

export const NewCharacter: FC<NewCharacterProps> = ({ changesOnCharacter }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");

  const sendNewCharacter = () => {
    axios.post("/character/new", { name: name, userID: 1 }).then((res) => {
      if (res.data.success) {
        onClose();
        changesOnCharacter();
      } else {
        alert("Error");
      }
    });
  };
  return (
    <Box
      as="button"
      onClick={onOpen}
      border="4px"
      borderRadius={30}
      width="100%"
      borderColor="yellow"
      backgroundColor="white"
      p={4}
      opacity={0.5}
      _hover={{
        opacity: 1,
        // bg: "yellow",
        cursor: "pointer",
      }}
    >
      <Text>Ajouter un personnage.</Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader backgroundColor="blue" color="white">
            Création d'un nouveau personnage
          </ModalHeader>
          <ModalBody p={6}>
            <Text mb={5}>Nom du personnage</Text>
            <Input
              mb={5}
              placeholder="Nom du perso"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></Input>
            <Button backgroundColor="yellow" onClick={sendNewCharacter}>
              Envoyer
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
