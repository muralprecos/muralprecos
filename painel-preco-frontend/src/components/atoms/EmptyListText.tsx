'use client'

type EmptyListTextProps = {
  children: React.ReactNode
} & React.AllHTMLAttributes<HTMLElement>

const EmptyListText: React.FC<EmptyListTextProps> = ({
  children,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <div className={`flex w-full flex-wrap md:flex-nowrap items-center justify-center ${_className}`} { ...opts}>
      <p>{children}</p>
    </div>
  );
};

export default EmptyListText;