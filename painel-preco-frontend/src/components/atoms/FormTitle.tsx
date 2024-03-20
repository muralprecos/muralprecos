import { Divider } from "@nextui-org/divider";
import NoSSR from "./NoSSR";

type FormTitleProps = {
  title: string
  children: React.ReactNode
  isNoSSR?: boolean
  gap?: number
} & React.AllHTMLAttributes<HTMLElement>

const FormTitle: React.FC<FormTitleProps> = ({
  title,
  children,
  isNoSSR=false,
  gap=3,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;
  const defaultClassName = `text-lg font-bold uppercase text-primary flex sm:flex-row sm:items-center sm:justify-between flex-col justify-start items-start w-full px-2 gap-${gap}`;

  const buttonArea = <>
    <Divider className="my-1 sm:hidden" />
    <div className={`flex justify-end w-full gap-${gap}`}>
      {children}
    </div>
  </>;

  return (
    <h1 className={_className || defaultClassName} { ...opts}>
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
      
    </h1>
  );
};

export default FormTitle;