'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ThemeSwitcher from "@/components/molecules/ThemeSwitcher";
import TTIcon from "../atoms/icons/TTIcon";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from 'react-redux'
import { logOut } from "@/redux/features/auth-slice";
import { hasString } from "@/utils/validateUtils";

export interface ILink {
  description: string
  link: string
}

type FormTitleProps = {
  links?: ILink[]
  children?: React.ReactNode
} & React.AllHTMLAttributes<HTMLElement>

const Header: React.FC<FormTitleProps> = ({
  children,
  links = [],
  ...opts
}) => {

  const username = useAppSelector((state) => state.authReducer.value.username);
  const _className = opts.className;
  delete opts.className;
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onClickLogout = () => {
    dispatch(logOut())
  };

  const activeLink = (url: string, pathname: string) => {
    return pathname === url
  };

  return (
    
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth={"full"}
      >
        <div className="justify-center flex flex-1">
          <div className="container flex justify-center">
            <NavbarContent className="sm:hidden" justify="start">
              <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
              <NavbarBrand >
                <TTIcon />
                <p className="font-bold text-inherit">Mural de Preço</p>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
              <NavbarBrand className="mr-4">
                <Link href={'/'} className="text-inherit">
                  <TTIcon />
                  <p className="ml-2 font-bold text-inherit">Mural de Preço</p>
                </Link>
              </NavbarBrand>
              {links.map((item, index) => (
                <NavbarItem key={`${item.description}-${index}`} isActive={activeLink(item.link, pathname)}>
                  <Link
                    className="w-full"
                    color="foreground"
                    href={item.link}
                  >
                    {item.description}
                  </Link>
                </NavbarItem>
              ))}
              
            </NavbarContent>

            <NavbarContent justify="end">
              <ThemeSwitcher />
              { !hasString(username) ?
                <div className="flex gap-4">
                  <NavbarItem className="hidden lg:flex">
                    <Link href="/login">Login</Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Button as={Link} color="default" href="/" variant="flat">
                      Criar Conta
                    </Button>
                  </NavbarItem>
                </div>
              :
                <div className="flex gap-4">
                  <NavbarItem>
                    { username }
                  </NavbarItem>
                  <NavbarItem className="hidden lg:flex">
                    <Button color="default" variant="flat" onClick={onClickLogout}>
                      Sair
                    </Button>
                  </NavbarItem>
                </div>
              }
            </NavbarContent>
          </div>
          

          <NavbarMenu>
            {links.map((item, index) => (
              <NavbarMenuItem key={`${item.description}-${index}`}>
                <Link
                  className="w-full"
                  color="foreground"
                  href={item.link}
                  size="lg"
                >
                  {item.description}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </div>
      </Navbar>
  );
};

export default Header;