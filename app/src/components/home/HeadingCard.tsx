import { FC } from "react";
import {
  HStack,
  Heading,
  Text,
  IconButton,
  Box,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

interface HeadingCardProps {
  name: string;
  rank: number;
  ID: number;
  changesOnCharacter: () => void;
}

export const HeadingCard: FC<HeadingCardProps> = ({
  name,
  rank,
  ID,
  changesOnCharacter,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteCharacter = () => {
    axios
      .delete("/character/delete", { data: { userID: 1, characterID: ID } })
      .then((res) => {
        changesOnCharacter();
      });
  };

  return (
    <HStack justifyContent="space-between" mb={2}>
      <Box>
        <Heading textAlign="center" size="md">
          {name}
        </Heading>
        <Text fontWeight="light">(Rank {rank})</Text>
      </Box>
      <IconButton
        onClick={onOpen}
        aria-label="delete-character"
        icon={<DeleteIcon />}
        _hover={{
          bg: "pink",
        }}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6}>
            <Text mb={5}>Voulez-vous vraiment supprimer ce personnage ?</Text>
            <HStack justifyContent="end">
              <Button backgroundColor="pink" onClick={deleteCharacter}>
                Supprimer
              </Button>
              <Button onClick={onClose}>Annuler</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};
