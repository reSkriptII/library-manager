import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#root/components/ui/card.tsx";
import type { BookData } from "../type";

export function BookCard({ book }: { book: BookData }) {
  return (
    <Card>
      <CardHeader className="flex flex-col-reverse">
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>
          {"By " + book.authors.map((author) => author.name).join(", ")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
