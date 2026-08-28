"use client";

import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

export interface IHeroBreadcrumbProps {
  className?: string;
  limit?: number;
  darkmode?: boolean;
  path: string;
}

/**
 * Route-derived breadcrumb for the hero. Rendering the slot is what turns the
 * breadcrumb on — there is no `hasBreadcrumb` flag any more.
 *
 * `darkMode` is deliberately not forwarded: the hero band is always
 * `bg-primary-900`, and `BreadcrumbDynamic` already defaults to dark.
 */
export default function HeroBreadcrumb({
  className,
  limit,
  darkmode,
  path,
}: IHeroBreadcrumbProps) {
  return (
    <Breadcrumbs
      path={path}
      darkmode={darkmode}
      limit={limit}
      className={className}
    />
  );
}
