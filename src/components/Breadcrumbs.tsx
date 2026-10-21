import { Fragment } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { ROUTE_LABELS } from "@/config/nav";

function labelFor(match: { routeId: string; pathname: string }) {
  if (ROUTE_LABELS[match.routeId]) return ROUTE_LABELS[match.routeId];
  // Fallback: use the last path segment, prettified.
  const segment = match.pathname.split("/").filter(Boolean).pop() ?? "";
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const matches = useRouterState({
    select: (s) => s.matches.map((m) => ({ routeId: m.routeId, pathname: m.pathname })),
  });

  const crumbs = matches.filter((m) => m.routeId !== "__root__");
  if (crumbs.length <= 1 && crumbs[0]?.routeId === "/") return null;

  return (
    <Breadcrumb className="w-full min-w-0 max-w-none border-b border-border/50 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" preload="intent" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((match, idx) => {
          const isLast = idx === crumbs.length - 1;
          const label = labelFor(match);
          return (
            <Fragment key={match.routeId}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage aria-current="page" className="font-medium">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={match.pathname} preload="intent">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
