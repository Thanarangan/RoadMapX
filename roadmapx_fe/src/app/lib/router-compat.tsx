import {
  Link as TanStackLink,
  Navigate as TanStackNavigate,
  Outlet,
  useLocation,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
  type LinkProps as TanStackLinkProps,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type To = string;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: To;
  children?: ReactNode;
};

type NavLinkRenderProps = {
  isActive: boolean;
};

type NavLinkProps = Omit<LinkProps, "className" | "children"> & {
  end?: boolean;
  className?: string | ((props: NavLinkRenderProps) => string);
  children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode);
};

export function Link({ to, ...props }: LinkProps) {
  return <TanStackLink to={to as TanStackLinkProps["to"]} {...props} />;
}

export function NavLink({ to, end, className, children, ...props }: NavLinkProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;
  const resolvedChildren = typeof children === "function" ? children({ isActive }) : children;

  return (
    <TanStackLink to={to as TanStackLinkProps["to"]} className={resolvedClassName} {...props}>
      {resolvedChildren}
    </TanStackLink>
  );
}

export function useNavigate() {
  const navigate = useTanStackNavigate();
  return (to: To, options?: { replace?: boolean }) =>
    navigate({ to: to as TanStackLinkProps["to"], replace: options?.replace });
}

export function useParams() {
  return useTanStackParams({ strict: false });
}

export function useSearchParams(): [URLSearchParams] {
  const location = useLocation();
  return [new URLSearchParams(location.searchStr)];
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  return <TanStackNavigate to={to as TanStackLinkProps["to"]} replace={replace} />;
}

export { Outlet };
