import { NavLink } from "react-router";
import type { ReactNode } from "react";

export function DashBoardNav() {
  return (
    <aside className="absolute top-18 h-screen w-50 bg-neutral-100 p-4">
      <nav>
        <ul>
          <LinkLi to="/dashboard/borrowed-books">Borrowed books</LinkLi>
          {}
          <li>
            <details>
              <summary>user</summary>
              <ul></ul>
            </details>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

type LinkLiProps = {
  to: string;
  children: ReactNode;
};

function LinkLi({ to, children }: LinkLiProps) {
  const styleClass = "block w-full pl-3 ";
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? styleClass + "bg-neutral-500 text-white"
            : styleClass + "hover:bg-neutral-300"
        }
      >
        {children}
      </NavLink>
    </li>
  );
}
