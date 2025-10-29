import axios from "axios";
import Profile from "./Profile";
import { Link } from "react-router";

export function HeaderBar() {
  async function handleLogout() {
    try {
      await axios.post(window.api + "/logout", null, { withCredentials: true });
    } catch (err) {}
    window.location.reload();
  }

  return (
    <div className="w-full bg-neutral-100">
      <header className="m-auto flex max-w-screen-xl items-center justify-between p-2">
        <Link to="/">Header bar</Link>

        <div className="flex items-center gap-16">
          <Link to="/dashboard">Dashboard</Link>
          <Profile />
        </div>
      </header>
    </div>
  );
}
