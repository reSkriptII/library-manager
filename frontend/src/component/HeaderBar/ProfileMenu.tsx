import { Link } from "react-router";
import type { user } from "../../type";

type props = { hidden: boolean; user: user | null };

export function ProfileMenu({ hidden, user }: props) {
  if (hidden) return;
  const divClass =
    "relative z-100 w-fit bg-neutral-100 p-2 shadow shadow-neutral-400";
  const iconClass = "relative bottom-0.5 mr-2 inline size-5";

  if (!user) {
    return (
      <div className={divClass}>
        <a className="block w-22 text-center" href="/login">
          <img
            src="/login-ico.svg"
            className="relative bottom-0.5 mr-2 inline size-5"
          />
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className={divClass}>
      <div className="w-48 bg-neutral-200 p-2 text-center">
        <h2 className="text-2xl">{user.name}</h2>
        <p>{user.role}</p>
      </div>
      <ul className="mt-2 *:block *:w-full *:pl-8 *:hover:bg-neutral-200">
        <li>
          <a href="/profile">
            <img
              src="/profile-menu-ico.svg"
              className={iconClass}
              alt="profile menu"
            />
            Profile
          </a>
        </li>
        <li>
          <a href="/dashboard">
            <img
              src="/dashboard-ico.svg"
              className={iconClass}
              alt="dashboard menu"
            />
            Dashboard
          </a>
        </li>
        <li>
          <button className="text-left">
            <img
              src="/logout-ico.svg"
              className={iconClass}
              alt="logout menu"
            />
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
}
