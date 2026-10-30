import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
  truncate?: boolean;
  backButtonOnClick?: () => void;
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
  truncate = false,
  icon,
  className,
  backButtonOnClick,
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
            { truncate ? (
              <div className="max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-3xl w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="font-medium text-foreground truncate">
                      {title}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[400px]">
                    <p className="font-medium">{title}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <span>
                {title}
              </span>
            )}
              {/* 
              
              */}
          </div>
          {description && (
            <span className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-2">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full sm:w-auto flex-wrap gap-2 justify-between sm:justify-end mt-2 sm:mt-0">
        {backButton && (
          <BackButton
            className="flex-1 sm:flex-none"
            onClick={backButtonOnClick ?? undefined}
          />
        )}
        {newQuoteButton && <ButtonNewQuote className="flex-1 sm:flex-none" />}
        {cartButton && <CartButton className="flex-1 sm:flex-none" />}
      </div>

      {children && <div className="w-full mt-2">{children}</div>}
    </div>
  );
}
