'use client'

import { useEffect, useState } from 'react'

import { Button } from '@nextui-org/button'
import { Badge, Link, NavbarItem, Popover, PopoverContent, PopoverTrigger, User } from '@nextui-org/react'
import CartIcon from '../atoms/icons/CartIcon';
import HeaderUserPopover from './HeaderUserPopover';


type HeaderUserInfoProps = {
  username: string
  cartsize: number
  logout: (event: React.MouseEvent<HTMLButtonElement>) => void
} //& React.AllHTMLAttributes<HTMLElement>

const HeaderUserInfo: React.FC<HeaderUserInfoProps> = ({
  username,
  cartsize,
  logout,
  ...opts
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <div className='flex gap-4' { ...opts}>
      <NavbarItem className="flex flex-row justify-center items-center gap-3">
        <Button className="sm:flex hidden" isIconOnly variant='flat' as={Link} href="/carrinho" >
          <Badge color="danger" content={cartsize} isInvisible={cartsize==0} shape="circle">
            <CartIcon
              classNamesArrSvg={['stroke-primary']}
              classNamesArrPath={['stroke-primary']}/>
          </Badge>
        </Button>
        <Popover showArrow placement="bottom">
          <PopoverTrigger>
            <User   
              as="button"
              name={username}
              className="transition-transform"
              // avatarProps={{
              //   src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
              // }}
            />
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <HeaderUserPopover cartsize={cartsize} username={username} logout={logout} />
          </PopoverContent>
        </Popover>
      </NavbarItem>
    </div>
  )
}

export default HeaderUserInfo;