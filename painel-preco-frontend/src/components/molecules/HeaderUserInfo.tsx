'use client'

import { useEffect, useState } from 'react'

import { Button } from '@nextui-org/button'
import { Avatar, Badge, Link, NavbarItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import CartIcon from '../atoms/icons/CartIcon';
import HeaderUserPopover from './HeaderUserPopover';
import { IUserInfo } from '@/interfaces/types';
import { get_gravatar } from '@/utils/gravatarUtils';


type HeaderUserInfoProps = {
  userInfo: IUserInfo
  cartsize: number
  logout: (event: React.MouseEvent<HTMLElement>) => void
} //& React.AllHTMLAttributes<HTMLElement>

const HeaderUserInfo: React.FC<HeaderUserInfoProps> = ({
  userInfo,
  cartsize,
  logout,
  ...opts
}) => {
  const [mounted, setMounted] = useState(false)
  const [gravatar, setGravatar] = useState<string|undefined>();

  useEffect(() => {
    setMounted(true)
    async function fetchGravatar() {
      setGravatar(await get_gravatar(userInfo.email));
    }
    fetchGravatar()
  }, [userInfo.email])

  if (!mounted) return null;

  return (
    <div className='flex gap-4' { ...opts}>
      <NavbarItem className="flex flex-row justify-center items-center gap-3">
        <Button className="sm:flex hidden" isIconOnly variant='flat' as={Link} href="/carrinho" >
          <Badge color="danger" content={cartsize} isInvisible={cartsize==0} shape="circle">
            <CartIcon
              classNamesArrSvg={['stroke-primary-title']}
              classNamesArrPath={['stroke-primary-title']}/>
          </Badge>
        </Button>
        <Popover showArrow placement="bottom" className='sm:flex hidden'>
          <PopoverTrigger>
            <Avatar
              name={userInfo.name}
              className="transition-transform sm:flex hidden cursor-pointer"
              src={gravatar}
            />
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <HeaderUserPopover cartsize={cartsize} userInfo={userInfo} gravatar={gravatar} logout={logout} />
          </PopoverContent>
        </Popover>
      </NavbarItem>
    </div>
  )
}

export default HeaderUserInfo;