'use client'

import React from "react";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Chip, Listbox, ListboxItem } from "@nextui-org/react";
import ThemeSwitcher from "./ThemeSwitcher";
const { version } = require('@/../package.json');

type HeaderUserPopoverProps = {
  username: string
  cartsize: number
  logout: (event: React.MouseEvent<HTMLElement>) => void
} //& React.AllHTMLAttributes<HTMLElement>

const HeaderUserPopover: React.FC<HeaderUserPopoverProps> = ({
  username,
  cartsize,
  logout,
  ...opts
}) => {

  return (
    <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3 min-w-[200px]">
          <Avatar isBordered radius="full" size="md"
            name={username}
            // src="https://i.pravatar.cc/150?u=a04258114e29026702d"
            />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{username}</h4>
            <h5 className="text-tiny tracking-tight text-default-500">Administrador</h5>
          </div>
        </div>
        <ThemeSwitcher />
      </CardHeader>
      <CardBody className="px-3 py-0">
        <Listbox
          aria-label="Actions"
        >
          <ListboxItem key="edit" href="/cotacao">Realizar Cotação</ListboxItem>
          {/* <ListboxItem key="edit" href="/">Editar Perfil</ListboxItem> */}
          <ListboxItem key="cart" href="/carrinho" endContent={cartsize > 0 ? <Chip size="sm" radius="sm" color="primary">{cartsize}</Chip> : ''
          }>Ver Carrinho</ListboxItem>
          <ListboxItem key="history" href="/cotacao/historico">Histórico de Cotações</ListboxItem>
          <ListboxItem key="validacao" href="/cotacao/validacao">Validar Cotação</ListboxItem>
          <ListboxItem key="logout" className="text-danger" color="danger" onClick={(e) => {logout(e)}}>Sair da Conta</ListboxItem>
        </Listbox>
      </CardBody>
      <CardFooter className="gap-1">
        <div className="flex justify-end flex-1">
          <p className="text-default-500 text-tiny mr-1">Mural de Preço versão </p>
          <p className="font-semibold text-default-600 text-tiny">{version}</p>
        </div>
      </CardFooter>
    </Card>
  );
};


export default HeaderUserPopover;