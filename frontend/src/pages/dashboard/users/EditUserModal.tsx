import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import type { User } from "#root/features/users/types.ts";
import { Label } from "#root/components/ui/label.tsx";
import { Input } from "#root/components/ui/input.tsx";
import { API_BASE_URL } from "#root/env.ts";
import { Avatar, AvatarImage } from "#root/components/ui/avatar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#root/components/ui/select.tsx";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { deleteUser, UpdateUser } from "#root/features/users/api.ts";

type EditUserModalProps = {
  open: boolean;
  user: User | null;
  setClose: () => void;
  onSave: () => void;
};

export function EditUserModal({
  open,
  user,
  setClose,
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<string>(user?.role ?? "member");
  const [deleting, setDeleting] = useState(false);

  function resetEditor() {
    setDeleting(false);
    setName(user?.name ?? "");
    setRole(user?.role ?? "member");
  }

  useEffect(() => {
    resetEditor();
  }, [user]);

  async function handleDelete() {
    if (!user) return;

    const res = await deleteUser(user.id);
    if (res?.ok) {
      toast.success("Successfully delete user");
    } else {
      toast.error("Error deleting book: " + (res?.message ?? "unknow error"));
    }

    onSave();
    return setClose();
  }

  async function handleUpdateUser() {
    if (!user) return;
    if (name !== user.name) {
      const res = await UpdateUser(user.id, "name", name);
      if (!res?.ok) {
        return toast.error(res?.message ?? "unknow error");
      }
    }
    if (role !== user.role) {
      const res = await UpdateUser(user.id, "role", role);
      if (!res?.ok) {
        return toast.error(res?.message ?? "unknow error");
      }
    }

    toast.success("Saved");
    onSave();
    return setClose();
  }

  async function handleSave() {
    if (!user) return toast.error("no user selected");
    if (deleting) return handleDelete();
    handleUpdateUser();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetEditor();
          setClose();
        }
      }}
    >
      <DialogOverlay />

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
          <DialogDescription className="sr-only">
            A form for editing a user
          </DialogDescription>
        </DialogHeader>

        {deleting && (
          <p className="flex gap-2 font-bold">
            <TriangleAlert /> This user will be deleted after save
          </p>
        )}

        <div className="flex justify-between gap-2">
          <div className="max-w-2/3">
            <p className="mb-4">{user?.email ?? "No user selected"}</p>
            <div>
              <Label htmlFor="name">name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <span className="text-sm font-medium">role</span>
              <Select onValueChange={(value) => setRole(value)} value={role}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="librarian">librarian</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user && (
              <Button
                className="mt-4 w-32"
                variant={deleting ? "outline" : "default"}
                onClick={() => setDeleting(!deleting)}
              >
                {deleting ? "Cancel Delete" : "Delete User"}
              </Button>
            )}
          </div>
          <AvatarDiv userId={user?.id} />
        </div>
        <DialogFooter>
          <div className="flex flex-row justify-end gap-2">
            <Button className="w-20" variant="outline" onClick={setClose}>
              Close
            </Button>

            <Button className="w-20" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AvatarDiv({ userId }: { userId?: number }) {
  return (
    <div className="mr-8 flex h-full items-center justify-center">
      <Avatar className="size-32">
        <AvatarImage
          className="size-32"
          src={
            userId
              ? API_BASE_URL + `/users/${userId}/avatar`
              : "/avatar-icon.svg"
          }
          alt="avatar image"
        />
        <AvatarFallback>
          <img src="/avatar-icon.svg" alt="avatar image"></img>
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
