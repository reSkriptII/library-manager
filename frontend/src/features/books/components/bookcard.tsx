import { API_BASE_URL } from "@/env.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { CircleCheck, CircleMinus } from "lucide-react";
import type { BookData } from "../type";
import { useContext } from "react";
import { ThemeProviderContext } from "@/contexts/ThemeContext.tsx";

export function BookCard({ book }: { book: BookData }) {
  const { theme } = useContext(ThemeProviderContext);
  const isAvailable = !book.lent && !book.reserveQueue;
  return (
    <Card>
      <CardHeader className="relative flex flex-col-reverse">
        <CardTitle className="text-xl">{book.title}</CardTitle>
        <CardDescription>
          {"By " + book.authors.map((author) => author.name).join(", ")}
        </CardDescription>
        <div className="absolute top-0 right-8">
          {isAvailable ? (
            <CircleCheck color="#0e1" aria-label="book available" />
          ) : (
            <CircleMinus color="#f00" aria-label="book not available" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row">
        <div className="flex h-42 max-w-36 items-center justify-center self-center overflow-hidden sm:h-52 md:w-1/3 lg:h-42 xl:mx-4 xl:h-52 xl:max-w-40">
          <img
            className="w-full"
            src={API_BASE_URL + `/books/${book.id}/cover`}
            alt={`cover image of ${book.title}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = theme === "dark" ? "/book-dark.svg" : "/book.svg";
            }}
          />
        </div>
        <div className="flex-grow">
          <div className="mb-6 text-lg font-bold">
            <div>Tags:</div>
            <ul className="inline-flex flex-wrap gap-2 rounded-md text-sm font-medium whitespace-nowrap">
              {book.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="bg-background dark:bg-input/30 dark:border-input flex items-center justify-center gap-2 rounded-md border px-2 text-base font-normal whitespace-nowrap shadow-xs"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6 text-lg font-bold">
            Availability:
            <div className="pl-2 text-base font-normal">
              {isAvailable ? "available" : "not available"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
