'use client'

type FormTitleProps = {
  children: React.ReactNode
} & React.AllHTMLAttributes<HTMLHeadingElement>

const InfoTitle: React.FC<FormTitleProps> = ({
  children,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <h3 className={`text-md font-bold uppercase text-primary-title flex flex-row items-center justify-between w-full bg-opacity-5 bg-primary-title p-4 ${_className}`} { ...opts}>
      { children }
    </h3>
  );
};

export default InfoTitle;