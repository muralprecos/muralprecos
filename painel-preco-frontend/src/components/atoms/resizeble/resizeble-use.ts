import { debounce } from 'lodash';
import { useState, useEffect } from 'react';


export type WorksOn = 'smaller' | 'bigger';
export type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Definir tipos para largura e altura
export type ResizeHeightObserverProps = {
  target: React.RefObject<HTMLDivElement>
  discount?: number
  worksOn?: WorksOn
  size?: Size
};

const getWindowHeight = () => {
  return window.innerHeight;
};

const getWindowWidth = () => {
  return window.innerWidth;
};

const getSizeWidth = (size: Size) : number => {
  return size == 'sm' ? 640 : size == 'md' ? 768 : size == 'lg' ? 1024 : size == 'xl' ? 1280 : 1536;
};

const getNewHeight = (width: number, discount: number, worksOn: WorksOn|undefined, size: Size|undefined) : number|null => {
  if (worksOn != null) {
    if (worksOn === 'smaller') {
      if (size && width > getSizeWidth(size)) {
        return null;
      }
    } else if (worksOn === 'bigger') {
      if (size && width < getSizeWidth(size)) {
        return null;
      }
    }
  }
  return getWindowHeight() - discount;
}

// Função utilitária para obter a largura e altura de um elemento
export const useResizeHeightObserver = ({target, discount = 0, worksOn, size} : ResizeHeightObserverProps): number|null => {

  
  const [height, setHeight] = useState<number|null>(getNewHeight(getWindowWidth(), discount, worksOn, size));


  useEffect(() => {
    const handleResize = () => {
      if (target.current !== null) {
        const debouncedSave = debounce(() => setHeight(getNewHeight(getWindowWidth(), discount, worksOn, size)), 500);
        debouncedSave();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [target]);

  return height;
};