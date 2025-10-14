export function ProfileMenu({ hidden }: { hidden: boolean }) {
  if (hidden) return;
  return (
    <div>
      <button>Log in</button>
      <button>Profile</button>
      <button>Dashboard</button>
      <button>Log out</button>
    </div>
  );
}
