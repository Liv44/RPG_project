import { FC } from "react";
import {
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
} from "@chakra-ui/react";

interface ModalEndFightProps {
  isOpen: boolean;
  message: string;
}

export const ModalEndFight: FC<ModalEndFightProps> = ({ isOpen, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        window.location.href = "/";
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={6}>
          <Text mb={5}>{message}</Text>
          <HStack justifyContent="end">
            <Button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Retour à la liste de personnages.
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
