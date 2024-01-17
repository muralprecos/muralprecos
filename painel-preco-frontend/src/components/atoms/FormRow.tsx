'use client'

type FormTitleProps = {
  children: React.ReactNode
  gap?: number
  py?: number
} & React.AllHTMLAttributes<HTMLElement>

const FormRow: React.FC<FormTitleProps> = ({
  children,
  gap=4,
  py=3,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <div className={`flex w-full flex-wrap md:flex-nowrap gap-${gap} py-${py} ${_className}`} { ...opts}>
      { children }
    </div>
  );
};

export default FormRow;