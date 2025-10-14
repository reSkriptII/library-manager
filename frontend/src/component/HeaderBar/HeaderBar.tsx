import Profile from "./Profile";

export function HeaderBar() {
  return (
    <div className="w-full bg-neutral-100">
      <header className="m-auto flex max-w-screen-xl items-center justify-between p-2">
        <h1>Header bar</h1>
        <Profile />
      </header>
    </div>
  );
}
