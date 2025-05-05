'use client'

import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import ThemeSwitcher from "@/components/molecules/ThemeSwitcher";
import TTIcon from "../atoms/icons/TTIcon";
import { useAppSelector } from "@/redux/store";
import HeaderUserInfo from "../molecules/HeaderUserInfo";
import { logoutAction } from "@/app/action/logoutActions";
import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { Session } from "next-auth";
import { getUserCartBySession } from "@/utils/cartUtils";
import { IUserInfo } from "@/interfaces/types";
import { getUserBySession } from "@/utils/sessionTokenAccessor";
const { version } = require('@/../package.json');

export interface ILink {
  description: string
  link: string
  access: 'private' | 'public' | 'all'
  isExternal?: boolean
}

type FormTitleProps = {
  session: Session | null
  links?: ILink[]
  children?: React.ReactNode
} & React.AllHTMLAttributes<HTMLElement>

const Header: React.FC<FormTitleProps> = ({
  children,
  session,
  links = [],
  ...opts
}) => {

  const pathname = usePathname();
  const _cartList = useAppSelector((state) => state.cartReducer);

  const [userInfo, setUserInfo] = React.useState<IUserInfo|null>(null);
  const [cartsize, setCartsize] = React.useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    if (session?.userInfo?.name) {
      setUserInfo(getUserBySession(session));
    }
  }, [session])

  useEffect(() => {
    const ulist = getUserCartBySession(_cartList, session);
    setCartsize(ulist.length);
  }, [_cartList])

  const activeLink = (url: string, pathname: string) => {
    return pathname === url
  };

  const isLogged = () : boolean => {
    return session?.userInfo?.name != null && session?.userInfo?.name != '';
  }

  const showLink = (item : ILink) : boolean => {
    return item.access === 'all' || (item.access === 'private' && isLogged()) || (item.access === 'public' && !isLogged());
  }

  const onClickLogout = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    logoutAction();
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
              <NavbarContent className="md:hidden" justify="start">
                <NavbarMenuToggle className="outline-none" aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
              </NavbarContent>

              <NavbarContent className="md:hidden pr-3" justify="center">
                <NavbarBrand >
                  <Link href={'/'} className="text-inherit" title={`Mural de Preço ${version}`}>
                    <TTIcon />
                    <p className="font-bold text-inherit">Mural de Preço</p>
                  </Link>
                </NavbarBrand>
              </NavbarContent>

              <NavbarContent className="hidden md:flex gap-4" justify="center">
                <NavbarBrand className="mr-4">
                  <Link href={'/'} className="text-inherit" title={`Mural de Preço ${version}`}>
                    <TTIcon />
                    <p className="ml-2 font-bold text-inherit">Mural de Preço</p>
                  </Link>
                </NavbarBrand>
                {links.map((item, index) => {
                  if (showLink(item)) {
                    return  <NavbarItem key={`${item.description}-${index}`} isActive={activeLink(item.link, pathname)}>
                      <Link
                        className="w-full"
                        color="foreground"
                        href={item.link}
                        target={item.isExternal ? "_blank" : "_self"}
                      >
                        {item.description}
                      </Link>
                    </NavbarItem>
                  }
                })}
                
              </NavbarContent>

              <ul className="flex-1">
                <NavbarContent className="gap-3 md:flex hidden" justify="end">
                  { !isLogged() ? (
                    <>
                      <ThemeSwitcher />
                      <NavbarItem>
                        <Link href={INITIAL_PAGE_LOGIN} className="text-primary-title">Acessar Conta</Link>
                      </NavbarItem>
                    </>
                  ) : (
                    <>
                      { userInfo && <HeaderUserInfo cartsize={cartsize} userInfo={userInfo} logout={onClickLogout} /> }
                    </>
                  )}
                </NavbarContent>
              </ul>
              
            </div>
            

            <NavbarMenu className="justify-between pb-16" >
              <div className="flex flex-col gap-3">
                {links.map((item, index) => {
                  if (showLink(item)) {
                    return <NavbarMenuItem key={`${item.description}-${index}`}>
                              <Link
                                  className="w-full"
                                  color="foreground"
                                  href={item.link}
                                  size="lg"
                                  target={item.isExternal ? "_blank" : "_self"}
                                >
                                  {item.description}
                                </Link>
                              </NavbarMenuItem>
                  }
                })}
              </div>
              <div className="flex flex-col gap-3 py-3 pb-20">
                <NavbarMenuItem>
                  <Link className="w-full" size="lg" color="foreground">
                    <ThemeSwitcher isCompact={false} variant="light"/>
                  </Link>
                </NavbarMenuItem>
                <>
                  { !isLogged() ?
                    <NavbarMenuItem>
                      <Button as={Link} className="w-full" size="lg" color="primary" href={'/login'}>
                        Acessar Conta
                      </Button>
                    </NavbarMenuItem>
                  :
                    <NavbarMenuItem>
                      <Button as={Link} className="w-full" size="lg" color="danger" onClick={onClickLogout}>
                        Sair da Conta
                      </Button>
                    </NavbarMenuItem>
                  }
                </>
                <NavbarMenuItem>
                  <p className="text-default-500 text-small m-2">
                    Mural de Preço versão
                    <span className="ml-2 font-semibold text-default-600 text-small">{version}</span>
                  </p>
                </NavbarMenuItem>
              </div>
            </NavbarMenu>
          </div>
      </Navbar>
  );
};

export default Header;