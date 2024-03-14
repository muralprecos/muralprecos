type FormTitleProps = {
  children: React.ReactNode
  gap?: number
} & React.AllHTMLAttributes<HTMLElement>

const FormTitle: React.FC<FormTitleProps> = ({
  children,
  gap,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <h1 className={`text-lg font-bold uppercase text-primary flex flex-row items-center justify-between w-full px-4 gap-${gap} ${_className}`} { ...opts}>
      { children }
    </h1>
  );
};

export default FormTitle;