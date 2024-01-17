'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react'

interface IProp extends Omit<ModalProps, "children"|"title"> {
  title: string
  description: string
  actionYes: () => void
}

function ModalConfirm({
  title,
  description,
  actionYes,
  isOpen,
  onOpenChange,
  className="w-full",
  ...opts
} : IProp) {

  const x : (isOpen: boolean) => void = (isOpen) => {
    if (!!onOpenChange) onOpenChange(isOpen);
  }

  const y : (onClose: () => void) => void = (onClose) => {
    actionYes();
    onClose();
  }

  return (
    <Modal {...opts} isOpen={isOpen} onOpenChange={x}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={(e) => y(onClose)}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
        </Modal>
  )
}

export default ModalConfirm;