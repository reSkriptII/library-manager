import { NavLink } from "react-router";
import { useContext, type ReactNode } from "react";
import { UserContext } from "#hook/UseProvider.tsx";

export function DashBoardNav() {
  const context = useContext(UserContext);
  if (!context) throw new Error("userContext not found");
  const { user } = context;

  return (
    <aside className="absolute top-18 h-[calc(100vh-72px)] w-50 bg-neutral-100 p-4">
      <nav>
        <ul>
          <LinkLi to="/dashboard/borrowed-books">Borrowed books</LinkLi>
          {(user?.role === "librarian" || user?.role === "admin") && (
            <li>
              <details>
                <summary>Librarian</summary>
                <ul>
                  <LinkLi to="/dashboard/borrow">Borrow Book</LinkLi>
                  <LinkLi to="/dashboard/return">Return Book</LinkLi>
                  <LinkLi to="/dashboard/register-user">Register User</LinkLi>
                </ul>
              </details>
            </li>
          )}
          {user?.role === "admin" && (
            <details>
              <summary>Admin</summary>
              <ul>
                <LinkLi to="/dashboard/managebook">Manage Book</LinkLi>
              </ul>
            </details>
          )}
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
