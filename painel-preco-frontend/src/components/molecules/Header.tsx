'use client'

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import IconHome from "../atoms/icons/IconHome";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ThemeSwitcher from "@/components/molecules/ThemeSwitcher";

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

  const _className = opts.className;
  delete opts.className;
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
                <IconHome />
                <p className="font-bold text-inherit">Mural de Preço</p>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
              <NavbarBrand className="mr-4">
                <Link href={'/'} className="text-inherit">
                  <IconHome />
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
              <NavbarItem className="hidden lg:flex">
                <Link href="#">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="warning" href="#" variant="flat">
                  Criar Conta
                </Button>
              </NavbarItem>
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