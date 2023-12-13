'use client'

type FormTitleProps = {
  children: React.ReactNode
} & React.AllHTMLAttributes<HTMLElement>

const FormRow: React.FC<FormTitleProps> = ({
  children,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <div className={`flex w-full flex-wrap md:flex-nowrap gap-4 py-3 ${_className}`} { ...opts}>
      { children }
    </div>
  );
};

export default FormRow;