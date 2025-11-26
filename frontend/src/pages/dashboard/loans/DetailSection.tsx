import { API_BASE_URL } from "@/env.ts";
import type { User } from "@/features/users/types.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type DetailSectionProps = {
  mode: "borrow" | "return";
  user?: User | null;
  bookTitle?: string;
  dueDate?: Date;
};
export function DetailSection({
  mode,
  user,
  bookTitle = "-",
  dueDate,
}: DetailSectionProps) {
  return (
    <section className="my-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card aria-description="selected book details">
          <CardContent>
            <CardTitle className="mb-2 text-center">Selected Book</CardTitle>
            <div className="flex items-center gap-4">
              <div className="h-full w-16 lg:size-24">
                <img src="" className="object-contain" />
              </div>
              <div className="grow">
                <div className="mb-2">
                  <Label htmlFor="title">Title</Label>
                  <Input readOnly id="title" value={bookTitle} />
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
          </CardContent>
        </Card>
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/avatar-icon.svg";
                  }}
                />
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
        <Button className="text-xl sm:col-span-2">{mode}</Button>
      </div>
    </section>
  );
}
