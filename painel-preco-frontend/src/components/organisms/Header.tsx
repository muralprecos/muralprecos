'use client'

import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import ThemeSwitcher from "@/components/molecules/ThemeSwitcher";
import TTIcon from "../atoms/icons/TTIcon";
import { useAppSelector } from "@/redux/store";
import HeaderUserInfo from "../molecules/HeaderUserInfo";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";

export interface ILink {
  description: string
  link: string
}

type FormTitleProps = {
  links?: ILink[]
  children?: React.ReactNode
} & React.AllHTMLAttributes<HTMLElement>

async function keycloakSessionLogOut(): Promise<boolean> {
  try {
    const res = await fetch(`/api/auth/logout`, { method: "GET" });
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

const Header: React.FC<FormTitleProps> = ({
  children,
  links = [],
  ...opts
}) => {

  const router = useRouter();
  const pathname = usePathname();
  const _cartList = useAppSelector((state) => state.cartReducer.value);

  const { data: session, status } = useSession();
  const [username, setUsername] = React.useState<string>('');
  const [cartsize, setCartsize] = React.useState<number>(0);
  const [isMenuLoaded, setIsMenuLoaded] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    if (status != 'loading') {
      setUsername(status ==  'authenticated' ? session?.userInfo?.name || '' : '');
      setCartsize(_cartList.length);
      setIsMenuLoaded(true);
    }
  }, [session, status, _cartList])

  // useEffect(() => {
  //   if (
  //     status != "loading" &&
  //     session && session?.error === "RefreshAccessTokenError"
  //   ) {
  //     signOut({ callbackUrl: "/" });
  //   }
  // }, [session, status]);

  const activeLink = (url: string, pathname: string) => {
    return pathname === url
  };

  const isLogged = () : boolean => {
    return status == 'authenticated';
  }

  const onClickLogout = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    keycloakSessionLogOut()
      .then((ok: boolean) => {
        if (ok) {
          signOut({ callbackUrl: "/" })
          router.push('/login');
        } else {
          //TODO: adicionar snack com erro de login
          console.log('ocorreu um problema, tente novamente')
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
                <NavbarMenuToggle className="outline-none" aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
              </NavbarContent>

              <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand >
                  <Link href={'/'} className="text-inherit">
                    <TTIcon />
                    <p className="font-bold text-inherit">Mural de Preço</p>
                  </Link>
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

              <ul className="flex-1">
                { isMenuLoaded &&
                  <ul className="flex-1">
                    { !isLogged() ?
                      <NavbarContent className="flex gap-3" justify="end">
                        <ThemeSwitcher className="sm:flex hidden" />
                        <NavbarItem className="hidden lg:flex">
                          <Link href="/login">Acessar Conta</Link>
                        </NavbarItem>
                      </NavbarContent>
                    :
                      <NavbarContent className="flex gap-3" justify="end">
                        <HeaderUserInfo cartsize={cartsize} username={username} logout={onClickLogout} />
                      </NavbarContent>
                    }
                  </ul>
                }
              </ul>
              
            </div>
            

            <NavbarMenu className="justify-between pb-16" >
              <div className="flex flex-col gap-3">
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
              </div>
              <div className="flex flex-col gap-3 py-3 pb-20">
                <NavbarMenuItem>
                  <Link className="w-full" size="lg" color="foreground">
                    <ThemeSwitcher isCompact={false} variant="light"/>
                  </Link>
                </NavbarMenuItem>
                { isMenuLoaded &&
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
                </> }
              </div>
            </NavbarMenu>
          </div>
      </Navbar>
  );
};

export default Header;