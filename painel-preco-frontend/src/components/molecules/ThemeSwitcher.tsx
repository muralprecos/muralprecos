'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@nextui-org/button'
import Icon from '../atoms/Icon'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = () => (
    theme == 'light'
  )

  const moonIcon = <Icon file="icons/moon-stars-svgrepo-com.svg"
                        classNamesArrPath={['fill-gray-500']}
                        isCursorPointer />;

  const sunIcon = <Icon file="icons/sun-svgrepo-com.svg" 
                        classNamesArrSvg={['fill-gray-200', 'stroke-gray-400']}
                        classNamesArrPath={['stroke-gray-400']}
                        isCursorPointer />;

  if (!mounted) return null;

  return (
    <div className='flex gap-4'>
      <Button isIconOnly variant='flat' onClick={() => setTheme(isLight() ? 'modern' : 'light')}>
        { isLight() ? sunIcon : moonIcon }
      </Button>
      
    </div>
  )
}