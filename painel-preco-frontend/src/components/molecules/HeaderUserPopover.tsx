'use client'

import React from "react";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Listbox, ListboxItem } from "@nextui-org/react";
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

  console.log(process.env)

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
          onAction={(key) => alert(key)}
        >
          <ListboxItem key="edit">Editar Perfil</ListboxItem>
          <ListboxItem key="cart">Carrinho</ListboxItem>
          <ListboxItem key="history">Histórico de Cotações</ListboxItem>
          <ListboxItem key="logout" className="text-danger" color="danger" onClick={(e) => {logout(e)}}>Sair</ListboxItem>
        </Listbox>
      </CardBody>
      <CardFooter className="gap-1">
        <div className="flex justify-end flex-1">
          <p className="text-default-500 text-tiny mr-1">Mural Preço versão </p>
          <p className="font-semibold text-default-600 text-tiny">{version}</p>
        </div>
      </CardFooter>
    </Card>
  );
};


export default HeaderUserPopover;