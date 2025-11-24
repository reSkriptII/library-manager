import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { ChevronsUpDown, CirclePlus, CircleX, X } from "lucide-react";
import { TagsSelect } from "@/components/tagsselect.tsx";
import { useGenres, useAuthors } from "../hooks.ts/useBookProps";
import type { BookFilter } from "../type";

type SearchBookProps = {
  filter: BookFilter;
  setFilter: (books: BookFilter) => void;
};

export function SearchBook({ filter, setFilter }: SearchBookProps) {
  const genres = useGenres();
  const authors = useAuthors();

  return (
    <div className="flex items-center gap-6">
      <Popover>
        <PopoverTrigger className="size-fit rounded-xl border px-3 py-2">
          <img
            className="size-6"
            src="/hamburger-icon.svg"
            aria-description="More search option"
          />
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="mb-4 flex flex-col">
            Genres:
            <div className="flex flex-wrap gap-1">
              {filter.genres.map((currentGenre) => (
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilter({
                      ...filter,
                      genres: filter.genres.filter(
                        (genre) => genre.id !== currentGenre.id,
                      ),
                    })
                  }
                >
                  {currentGenre.name}
                  <X />
                </Button>
              ))}

              <TagsSelect
                name="genre"
                options={genres}
                onSelect={(value) =>
                  setFilter({ ...filter, genres: [...filter.genres, value] })
                }
              >
                <Button variant="outline" className="text-xs text-neutral-400">
                  <CirclePlus />
                  Add genre
                </Button>
              </TagsSelect>
            </div>
          </div>
          <div className="flex flex-col">
            Author:
            <TagsSelect
              name="author"
              options={authors}
              onSelect={(value) => setFilter({ ...filter, author: value })}
            >
              <Button variant="outline">
                {filter.author ? filter.author.name : "Select author..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </TagsSelect>
            {filter.author && (
              <Button
                onClick={() => setFilter({ ...filter, author: null })}
                variant="outline"
                className="mt-1 w-fit px-4 text-xs text-neutral-400"
              >
                <CircleX />
                remove author
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Input
        type="text"
        id="title"
        placeholder="Book title"
        value={filter.title}
        onChange={(e) => setFilter({ ...filter, title: e.target.value })}
      />
    </div>
  );
}
