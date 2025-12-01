import { useRef, useState } from "react";
import { UserTabel } from "@/features/users/components/usertable.tsx";
import { useUserList } from "@/features/users/hooks.ts";
import { EditUserModal } from "./EditUserModal";
import { SearchUser } from "./SearchUser";
import type { User } from "@/features/users/types.ts";

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const refreshRef = useRef(0);
  const users = useUserList(refreshRef.current);
  const [filter, setFilter] = useState({ id: "", name: "" });

  const filteredUser = filter.id
    ? users.filter((user) => String(user.id).startsWith(filter.id))
    : filter.name
      ? users.filter((user) => user.name.includes(filter.name))
      : users;

  return (
    <>
      <h1 className="mt-8 mb-4 text-2xl font-bold">Uses</h1>
      <SearchUser filter={filter} setFilter={setFilter} />
      <UserTabel
        users={filteredUser}
        onSelect={(user) => {
          console.log("test");
          setEditingUser(user);
          setModalOpen(true);
        }}
      />
      <EditUserModal
        open={modalOpen}
        user={editingUser}
        setClose={() => setModalOpen(false)}
        onSave={() => {
          ++refreshRef.current;
        }}
      />
    </>
  );
}
