import type { LoanData } from "@/features/loans/types.ts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { API_BASE_URL } from "@/env.ts";
import type { User } from "../types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#root/components/ui/avatar.tsx";

type UserTabelProps = {
  users: User[];
  onSelect: (user: User) => void;
};

export function UserTabel({ users, onSelect }: UserTabelProps) {
  return (
    <>
      <Table>
        <TableCaption>Users</TableCaption>
        <TableHeader>
          <TableRow className="flex">
            <TableHead className="w-16 text-center">avatar</TableHead>
            <TableHead className="w-8 text-center">ID</TableHead>
            <TableHead className="w-36 text-center md:w-48">name</TableHead>
            <TableHead className="w-48 text-center md:w-56">email</TableHead>
            <TableHead className="w-16 text-center">role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="flex items-center"
              onClick={() => onSelect(user)}
            >
              <TableCell className="w-16">
                <Avatar className="size-12">
                  <AvatarImage
                    src={API_BASE_URL + `/users/${user.id}/avatar`}
                  />
                  <AvatarFallback>
                    <img
                      src="/avatar-icon.svg"
                      className="size-10 object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="w-8 text-center">{user.id}</TableCell>
              <TableCell className="w-36 md:w-48">
                <span className="text-wrap">{user.name}</span>
              </TableCell>
              <TableCell className="w-48 md:w-56">
                <span className="text-wrap">{user.email}</span>
              </TableCell>
              <TableCell className="w-16">{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!users[0] && <p className="border-b p-2 text-center">no user found</p>}
    </>
  );
}
