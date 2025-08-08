import { ReactNode, ElementType, Fragment } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BackButton, ButtonNewQuote } from "../atoms/Buttons";

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
  titleClassName = "text-2xl font-bold tracking-tight truncate",
  subtitleClassName = "text-sm text-muted-foreground mt-1 truncate",
  breadcrumbItems,
  backButton = false,
  newQuoteButton = false,
}: PageHeaderProps) {
  const hasTitle = !!title;
  const hasBreadcrumb = breadcrumbItems && breadcrumbItems.length > 0;

  return (
    <div className="sticky top-0 z-40 border-b bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between gap-4">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="h-9 w-9 shrink-0" />

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
              <Separator orientation="vertical" className="h-4" />
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

        {/* Children + BackButton no lado oposto */}
        <div className="flex items-center gap-2 shrink-0">
          {children}
          {newQuoteButton && <ButtonNewQuote />}
          {backButton && <BackButton />}
        </div>
      </div>
    </div>
  );
}
