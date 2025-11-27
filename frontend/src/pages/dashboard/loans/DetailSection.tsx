import { API_BASE_URL } from "@/env.ts";
import type { User } from "@/features/users/types.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type DetailSectionProps = {
  user?: User | null;
  book?: { id: number; title: string } | null;
  dueDate?: Date | null;
  validBook: boolean;
};

export function DetailSection({
  user,
  book,
  dueDate,
  validBook,
}: DetailSectionProps) {
  return (
    <section className="my-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <BookCard book={book} dueDate={dueDate} valid={validBook} />
        <BorrowerCard user={user} />
      </div>
    </section>
  );
}

type BookCardProps = {
  book?: { id: number; title: string } | null;
  dueDate?: Date | null;
  valid: boolean;
};

function BookCard({ book, dueDate, valid }: BookCardProps) {
  return (
    <Card>
      <CardContent className="h-38">
        <CardTitle className="mb-2 text-center">Selected Book</CardTitle>
        <div className="flex gap-4">
          <div className="flex h-28 w-16 items-center justify-center overflow-hidden lg:size-24">
            <img
              src={
                book ? API_BASE_URL + `/books/${book.id}/cover` : "/book.svg"
              }
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/book.svg";
              }}
            />
          </div>
          <div className="grow">
            <div className="mb-2">
              <Label htmlFor="title">Title</Label>
              <Input readOnly id="title" value={book?.title ?? "-"} />
            </div>
            <div>
              <Label htmlFor="due-date">Due date</Label>
              <Input
                readOnly
                id="due-date"
                value={dueDate?.toDateString() ?? "-"}
              />
            </div>
          </div>
        </div>
        {!valid && (
          <p className="mt-1 text-center font-bold">
            This book isn't borrowed by user
          </p>
        )}
        {valid && extractDate(dueDate) < new Date() && (
          <p className="mt-1 text-center font-bold">Late</p>
        )}
      </CardContent>
    </Card>
  );
}

function BorrowerCard({ user }: { user?: User | null }) {
  return (
    <Card className="h-full">
      <CardContent>
        <CardTitle className="text-center">User</CardTitle>
        <div className="flex h-full items-center gap-4">
          <Avatar className="size-16 lg:size-24">
            <AvatarImage
              src={
                user
                  ? API_BASE_URL + `/users/${user.id}/avatar`
                  : "/avatar-icon.svg"
              }
            />
            <AvatarFallback>
              <img src="/avatar-icon.svg" />
            </AvatarFallback>
          </Avatar>
          <div className="grow">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input readOnly id="name" value={user?.name ?? "-"} />
            </div>
            <div className="mt-2">
              <Label htmlFor="email">Email</Label>
              <Input readOnly id="email" value={user?.email ?? "-"} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function extractDate(date?: Date | null) {
  if (!date) {
    return new Date(0);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
