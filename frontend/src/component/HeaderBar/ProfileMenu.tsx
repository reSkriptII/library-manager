import axios from "axios";
import { Link } from "react-router";
import type { user } from "../../type";
import { EditProfile } from "./EditProfile";

type props = { hidden: boolean; user: user | null };

export function ProfileMenu({ hidden, user }: props) {
  if (hidden) return;

  async function handleLogout() {
    try {
      await axios.post(window.api + "/logout", null, { withCredentials: true });
    } catch (err) {}
    window.location.reload();
  }

  const divClass =
    "relative z-100 w-fit bg-neutral-100 p-2 shadow shadow-neutral-400";

  if (!user) {
    return (
      <div className={divClass}>
        <Link className="block w-22 text-center" to="/login">
          <img
            src="/login-ico.svg"
            className="relative bottom-0.5 mr-2 inline size-5"
          />
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className={divClass}>
      <div className="w-48 bg-neutral-200 p-2 text-center">
        <EditProfile />

        <h2 className="text-2xl">{user.name}</h2>
        <p>{user.role}</p>
      </div>

      <button
        className="mt-2 block w-full text-center hover:bg-neutral-200"
        onClick={handleLogout}
      >
        <img
          src="/logout-ico.svg"
          className="relative bottom-0.5 mr-2 inline size-5"
          alt="logout menu"
        />
        Log out
      </button>
    </div>
  );
}
