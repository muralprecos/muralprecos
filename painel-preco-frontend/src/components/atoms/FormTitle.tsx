
import { Divider } from "@nextui-org/react";
import NoSSR from "./NoSSR";

type HTMLHeadingElements = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'section';

type FormTitleProps = {
  title: string
  children?: React.ReactNode
  isNoSSR?: boolean
  gap?: number
  addClassName?: string
  as?: HTMLHeadingElements
} & React.AllHTMLAttributes<HTMLElement>

const FormTitle: React.FC<FormTitleProps> = ({
  title,
  children,
  isNoSSR=false,
  gap=3,
  addClassName,
  as: Tag = "h1",
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;
  const defaultClassName = `text-lg font-bold uppercase text-primary-title flex sm:flex-row sm:items-center sm:justify-between flex-col justify-start items-start w-full px-2 gap-${gap} ${addClassName}`;

  const buttonArea = <>
    <Divider className="my-1 sm:hidden" />
    <div className={`flex justify-end w-full gap-${gap}`}>
      {children}
    </div>
  </>;

  return (
    <Tag className={_className || defaultClassName} { ...opts}>
      <div className="flex-auto w-full">
        {title}
      </div>
      { isNoSSR ? 
        <NoSSR>
          {buttonArea}
        </NoSSR> : 
        <>
          {buttonArea}
        </>
      }
    </Tag>
  );
};

export default FormTitle;