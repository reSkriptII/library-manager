import { useContext } from "react";
import { API_BASE_URL } from "@/env.ts";
import { ThemeProviderContext } from "@/contexts/ThemeContext.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useGetUser } from "@/features/users/hooks.ts";

type DetailSectionProps = {
  borrowerId: number;
  book: { id: number; title: string } | null;
  dueDate: Date | null;
  showDisclaimer: boolean;
  disclaimer: string;
};

export function DetailSection({
  borrowerId,
  book,
  dueDate,
  showDisclaimer,
  disclaimer,
}: DetailSectionProps) {
  return (
    <section className="my-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <BookCard
          book={book}
          dueDate={dueDate}
          showDisclaimer={showDisclaimer}
          disclaimer={disclaimer}
        />
        <BorrowerCard borrowerId={borrowerId} />
      </div>
    </section>
  );
}

type BookCardProps = {
  book?: { id: number; title: string } | null;
  dueDate?: Date | null;
  showDisclaimer: boolean;
  disclaimer: string;
};

function BookCard({
  book,
  dueDate,
  showDisclaimer,
  disclaimer,
}: BookCardProps) {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <Card>
      <CardContent className="h-38">
        <CardTitle className="mb-2 text-center">Selected Book</CardTitle>
        <div className="flex gap-4">
          <div className="flex h-28 w-16 items-center justify-center overflow-hidden lg:size-24">
            <img
              src={
                book
                  ? API_BASE_URL + `/books/${book.id}/cover`
                  : theme === "dark"
                    ? "/book-dark.svg"
                    : "/book.svg"
              }
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = theme === "dark" ? "/book-dark.svg" : "/book.svg";
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
        {showDisclaimer && (
          <p className="mt-1 text-center font-bold">{disclaimer}</p>
        )}
      </CardContent>
    </Card>
  );
}

function BorrowerCard({ borrowerId }: { borrowerId: number }) {
  const { theme } = useContext(ThemeProviderContext);
  const borrower = useGetUser(borrowerId);
  return (
    <Card className="h-full">
      <CardContent>
        <CardTitle className="text-center">User</CardTitle>
        <div className="flex h-full items-center gap-4">
          <Avatar className="size-16 lg:size-24">
            <AvatarImage
              src={
                borrower
                  ? API_BASE_URL + `/users/${borrower.id}/avatar`
                  : theme === "dark"
                    ? "/avatar-icon-dark.svg"
                    : "/avatar-icon.svg"
              }
            />
            <AvatarFallback>
              <img
                src={
                  theme === "dark"
                    ? "/avatar-icon-dark.svg"
                    : "/avatar-icon.svg"
                }
              />
            </AvatarFallback>
          </Avatar>
          <div className="grow">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input readOnly id="name" value={borrower?.name ?? "-"} />
            </div>
            <div className="mt-2">
              <Label htmlFor="email">Email</Label>
              <Input readOnly id="email" value={borrower?.email ?? "-"} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
