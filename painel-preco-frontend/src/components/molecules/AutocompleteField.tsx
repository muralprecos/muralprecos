"use client"

import { forwardRef, ForwardedRef, Fragment, useState, useEffect, useLayoutEffect, useRef, useImperativeHandle, useMemo } from 'react';

import { AutocompleteGroupedOption, useAutocomplete, UseAutocompleteProps } from '@mui/base/useAutocomplete';
import { Popper } from '@mui/base/Popper';
import useForkRef from '@mui/utils/useForkRef';

import { IAPISearchProps, IItemAutocomplete, IObjetoAPI, IObjetoAPISearch, IReturnRequestAPI } from '@/interfaces/types';
import classNames from 'classnames';
import { debounce } from 'lodash';

interface IAutocompleteField {
  emptyMsg?: string
  autocompleteService?: (props: IAPISearchProps<IObjetoAPISearch>) => Promise<IReturnRequestAPI<IObjetoAPI>>
}

export interface AutocompleteFieldHandle extends HTMLDivElement {
  isLoading: () => boolean
};

const AutocompleteField = forwardRef(function Autocomplete(
  props: UseAutocompleteProps<IItemAutocomplete, false, false, false> & IAutocompleteField,
  ref: ForwardedRef<Partial<AutocompleteFieldHandle>>,
) {

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    popupOpen,
    anchorEl,
    inputValue,
    setAnchorEl,
    id,
  } = useAutocomplete(props);

  const {
    emptyMsg = 'Sem Resultados',
    autocompleteService
  } = props;

  const rootRef = useForkRef(ref, setAnchorEl);
  const elementInputRef = useRef(null);

  const [width, setWidth] = useState<number>(300);
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [dataHover, setDataHover] = useState<boolean>(false);
  const [liHover, setLiHover] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<readonly IItemAutocomplete[] | AutocompleteGroupedOption<IItemAutocomplete>[]>(groupedOptions);
  const [value, setValue] = useState<IItemAutocomplete | null>(null);

  const resizeAutocomplete = () => {
    const el = elementInputRef?.current;
    if (el != null) { 
      setWidth(el['offsetWidth'])
    }
  }

  useLayoutEffect(() => {
    resizeAutocomplete();
  }, []);

  useEffect(() => {
    resizeAutocomplete();
    window.addEventListener('resize', resizeAutocomplete);
    return () => {
      window.removeEventListener('resize', resizeAutocomplete);
    }
  }, []);

  useEffect(() => {
    setIsFilled(inputValue != null && inputValue != '');
  }, [inputValue]);

  useImperativeHandle(ref, () => ({
    isLoading: () => {
      return loading
    }
  }), [loading])

  const fetch = useMemo(
    () =>
      debounce(
        (
          request : IAPISearchProps<IObjetoAPISearch>,
          callback: (results?: IReturnRequestAPI<IObjetoAPI>) => void,
        ) => {
          if (autocompleteService) {
            autocompleteService(request).then(callback)
          }
        },
        400
      ),
    [autocompleteService],
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService) {
      return undefined;
    }

    if (inputValue === '' || inputValue.length < 3) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    if (!loading) {
      setLoading(true);
      fetch({
        params: {
          nome: inputValue
        },
        size: 15
      }, (result?: IReturnRequestAPI<IObjetoAPI>) => {
        setLoading(false);
        if (active) {
          let newOptions: readonly IItemAutocomplete[] = [];

          if (value) {
            newOptions = [value];
          }

          if (result) {
            const itens:IItemAutocomplete[] = [];
            result.content.forEach(it => {
              itens.push({
                description: it.nome,
                key: it.uuid
              })
            });
            newOptions = [...newOptions, ...itens];
          }

          setOptions(newOptions);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, autocompleteService]);



  const isFilledWithin = () => {
    return focused || isFilled;
  }

  const printInfo = (e: any) => {
    const el = (e.target as HTMLElement);
    if (el != null && el.id != null) {
      setLiHover(el.id)
    }
  }

  const checkLiHover = (a: any) => {
    return `${id}-option-${a}` == liHover;
  }

  const clearInfo = () => {
    setLiHover('')
  }

  const LI_CLASSES = "flex group items-center justify-between relative py-1.5 w-full box-border subpixel-antialiased cursor-pointer tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:dark:ring-offset-background-content1 data-[hover=true]:text-default-foreground data-[selectable=true]:focus:bg-default data-[selectable=true]:focus:text-default-foreground px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80";

  const GROUP_DATA_CLASS = 'relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2 text-foreground';

  const LABEL_CLASS = "block text-foreground-600 cursor-text absolute z-10 pointer-events-none will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none font-normal group-data-[filled-within=true]:font-medium group-data-[filled-within=true]:pointer-events-auto text-small group-data-[filled-within=true]:text-tiny group-data-[filled-within=true]:-translate-y-[calc(50%_+_theme(fontSize.small)/2_-_4px)]";

	return (
		<div className={classNames({
      'flex flex-col w-full group': true,
      'is-filled': isFilled
    })}
      ref={elementInputRef}
      data-focus={focused}
      data-focus-within={focused}
      data-filled-within={isFilledWithin()}
      data-hover={dataHover}>
      <Fragment>
        <div
          {...getRootProps()}
          onMouseEnter={() => setDataHover(true) }
          onMouseLeave={() => setDataHover(false) }
          ref={rootRef}
          data-focus={focused}
          data-focus-within={focused}
          data-filled-within={isFilledWithin()}
          data-hover={dataHover}
          className={GROUP_DATA_CLASS}
        >
          <label className={LABEL_CLASS}>
            { id }
          </label>
          <input
            {...getInputProps()} 
            className='w-full h-full font-normal !bg-transparent outline-none placeholder:text-foreground-500 text-small pt-4'
          />
        </div>

        {anchorEl && (
          <Popper
            open={popupOpen}
            anchorEl={anchorEl}
            slots={{ root: 'div' }}
            slotProps={{ root: { className: 'relative shadow-medium', style: { minWidth: `${width}px`, zIndex: 1001 } } }}
            style={{
              minWidth: `${width}px`,
              borderRadius: '12px',
              overflow: 'auto',
              outline: '0px',
              maxHeight: '290px',
              zIndex: 1
            }}
          >
            
            <ul 
                {...getListboxProps()}
                className='w-full flex flex-col outline-none p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 overflow-visible rounded-medium shadow-medium'
              >
                { !loading ? (
                  <div>
                    {options.length > 0 ? (
                      (options as IItemAutocomplete[]).map((option, index) => (
                        <li
                          {...getOptionProps({ option, index })}
                          key={index} 
                          className={LI_CLASSES}
                          onMouseEnter={printInfo}
                          onMouseUp={clearInfo}
                          data-hover={checkLiHover(index)}
                        >
                          <span data-label="true" className="flex-1 text-small font-normal truncate">{option.description}</span>
                        </li>
                      ))
                    ) : (
                      <li className={LI_CLASSES}>
                          <span data-label="true" className="flex-1 text-small font-normal truncate">{emptyMsg}</span>
                      </li>
                    )}
                  </div>
                ) : (
                  <li className={LI_CLASSES}>
                      <span data-label="true" className="flex-1 text-small font-normal truncate">Carregando...</span>
                  </li>
                )}
          
        </ul>
            
          </Popper>
        )}
      </Fragment>
    </div>
	);
});

export default AutocompleteField;
