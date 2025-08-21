import { BackButton, ButtonNewQuote, CartButton } from "./Buttons";
import { cn } from "@/lib/utils";

type FormTitleProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  backButton?: boolean;
  newQuoteButton?: boolean;
  cartButton?: boolean;
  gap?: number;
  addClassName?: string;
  uppercase?: boolean;
} & React.AllHTMLAttributes<HTMLElement>;

export default function FormTitle({
  title,
  description,
  children,
  gap = 3,
  addClassName,
  as: Tag = "h1",
  backButton = false,
  newQuoteButton = false,
  cartButton = false,
  uppercase = true,
  icon,
  className,
  ...rest
}: FormTitleProps) {
  const defaultClassName = cn(
    "text-lg font-bold flex flex-col sm:flex-row sm:items-center sm:justify-between w-full px-2",
    uppercase && "uppercase",
    `gap-${gap}`,
    addClassName,
    className
  );

  return (
    <div className={defaultClassName} {...rest}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0 flex-1">
        <div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{title}</span>
          </div>
          {description && (
            <span className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-2">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex w-full sm:w-auto flex-wrap gap-2 justify-between sm:justify-end mt-2 sm:mt-0">
        {backButton && <BackButton className="flex-1 sm:flex-none" />}
        {newQuoteButton && <ButtonNewQuote className="flex-1 sm:flex-none" />}
        {cartButton && <CartButton className="flex-1 sm:flex-none" />}
      </div>

      {/* Children abaixo */}
      {children && <div className="w-full mt-2">{children}</div>}
    </div>
  );
}
