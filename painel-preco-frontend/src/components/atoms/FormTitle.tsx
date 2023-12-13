type FormTitleProps = {
  children: React.ReactNode
  gap?: number
} & React.AllHTMLAttributes<HTMLElement>

const FormTitle: React.FC<FormTitleProps> = ({
  children,
  gap,
  ...opts
}) => {
  return (
    <h1 { ...opts}>
      { children }
    </h1>
  );
};

export default FormTitle;