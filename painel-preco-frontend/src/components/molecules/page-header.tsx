import { ReactNode, ElementType, Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BackButton, ButtonNewQuote } from "@/components/atoms/Buttons";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  titleAs?: ElementType;
  subtitleAs?: ElementType;
  titleClassName?: string;
  subtitleClassName?: string;
  breadcrumbItems?: {
    label: string;
    href?: string;
    hiddenOnMobile?: boolean;
  }[];
  backButton?: boolean;
  newQuoteButton?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  children,
  titleAs: Title = "h1",
  subtitleAs: Subtitle = "p",
  titleClassName = "text-xl sm:text-2xl font-bold text-foreground",
  subtitleClassName = "text-sm text-muted-foreground mt-1",
  breadcrumbItems,
  backButton = false,
  newQuoteButton = false,
}: PageHeaderProps) {
  const hasTitle = !!title;
  const hasBreadcrumb = breadcrumbItems && breadcrumbItems.length > 0;

  return (
    <div className="px-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        {/* Conteúdo principal (título + breadcrumb) */}
        <div className="flex-1 min-w-0">
          {hasTitle && (
            <>
              <Title className={titleClassName}>{title}</Title>
              {subtitle && (
                <Subtitle className={subtitleClassName}>{subtitle}</Subtitle>
              )}
            </>
          )}

          {hasBreadcrumb && (
            <div className="flex items-center gap-2 mt-1">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    const className = item.hiddenOnMobile
                      ? "hidden md:block"
                      : "";

                    return (
                      <Fragment key={index}>
                        <BreadcrumbItem className={className}>
                          {item.href && !isLast ? (
                            <BreadcrumbLink href={item.href}>
                              {item.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator className={className} />
                        )}
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>

        {/* Children + Buttons no lado oposto */}
        <div className="flex items-center gap-2 shrink-0">
          {children}
          {newQuoteButton && <ButtonNewQuote />}
          {backButton && <BackButton />}
        </div>
      </div>
    </div>
  );
}
