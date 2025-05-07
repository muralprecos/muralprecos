'use client'

import React, { useState } from "react";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import ThemeSwitcher from "./ThemeSwitcher";
import { IUserInfo } from "@/interfaces/types";
const { version } = require('@/../package.json');

type HeaderUserPopoverProps = {
  userInfo: IUserInfo
  cartsize: number
  gravatar: string|undefined
  logout: (event: React.MouseEvent<HTMLElement>) => void
} //& React.AllHTMLAttributes<HTMLElement>

const HeaderUserPopover: React.FC<HeaderUserPopoverProps> = ({
  userInfo,
  cartsize,
  gravatar,
  logout,
  ...opts
}) => {

  const [loading, setLoading] = useState<boolean>();

  const handleLogout = async (event: React.MouseEvent<HTMLElement>) => {
    setLoading(true);
    await logout(event);
  }

  return (
    <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3 min-w-[200px]">
          <Avatar isBordered radius="full" size="md"
            name={userInfo.name}
            src={gravatar}
            />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{userInfo.name}</h4>
            <h5 className="text-tiny tracking-tight text-default-500">{userInfo.organizacao?.nome}</h5>
          </div>
        </div>
        <ThemeSwitcher />
      </CardHeader>
      <Divider />
      <CardBody className="px-3 py-0 mt-2">
        <Listbox
          aria-label="Actions"
        >
          <ListboxItem showDivider key="perfil" href="/usuario/perfil">Editar Perfil</ListboxItem>
          <ListboxItem key="edit" href="/cotacao">Realizar Cotação</ListboxItem>
          <ListboxItem key="cart" href="/carrinho" endContent={cartsize > 0 ? <Chip size="sm" radius="sm" color="primary">{cartsize}</Chip> : ''
          }>Ver Carrinho</ListboxItem>
          <ListboxItem key="history" href="/cotacao/historico">Histórico de Cotações</ListboxItem>
          <ListboxItem showDivider key="validacao" href="/cotacao/validacao">Validar Cotação</ListboxItem>
          <ListboxItem key="logout" className="text-danger" color="danger" onClick={handleLogout} isDisabled={loading}>
            { !loading ? 'Sair da Conta' : 'Saindo...' }
          </ListboxItem>
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