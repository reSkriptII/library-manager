import { UserTabel } from "#root/features/users/components/usertable.tsx";
import { useUserList } from "#root/features/users/hooks.ts";
import { useRef, useState } from "react";
import { EditUserModal } from "./EditUserModal";
import type { User } from "#root/features/users/types.ts";

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const refreshRef = useRef(0);
  const users = useUserList(refreshRef.current);

  return (
    <>
      <h1 className="mt-8 mb-4 text-2xl font-bold">Uses</h1>
      <UserTabel
        users={users}
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
