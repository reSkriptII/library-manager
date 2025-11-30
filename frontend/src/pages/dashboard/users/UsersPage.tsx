import { UserTabel } from "#root/features/users/components/usertable.tsx";

export function UsersPage() {
  return (
    <>
      <h1 className="mt-8 mb-4 text-2xl font-bold">Uses</h1>

      <UserTabel
        users={[{ id: 0, name: "test", role: "member", email: "test@mail" }]}
        onSelect={() => {}}
      />
    </>
  );
}
