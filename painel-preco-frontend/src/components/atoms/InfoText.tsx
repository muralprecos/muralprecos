'use client'

type FormTitleProps = {
  label: string
  orientarion?: 'col' | 'row'
  children: React.ReactNode
} & React.AllHTMLAttributes<HTMLHeadingElement>

const InfoText: React.FC<FormTitleProps> = ({
  children,
  orientarion = 'col',
  label,
  ...opts
}) => {

  const _className = opts.className;
  delete opts.className;

  return (
    <div className={`flex w-full flex-wrap md:flex-nowrap gap-2 py-2 flex-${orientarion} ${_className}`} { ...opts}>
      <label className="text-sm font-bold uppercase text-primary-600 flex flex-row items-center justify-between ">
        {label}:
      </label>
      <div className="flex flex-row items-center justify-between">
        { children }
      </div>
    </div>
  );
};

export default InfoText;