import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { ChevronsUpDown, CircleX, Menu } from "lucide-react";
import { TagListSelect, TagsSelect } from "@/components/tagsselect.tsx";
import { useGenres, useAuthors } from "../hooks.ts/useBookProps";
import type { BookFilter } from "../type";

export const filterDefault = { title: "", genres: [], author: null };

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
          <Menu />
        </PopoverTrigger>
        <PopoverContent align="start">
          <TagListSelect
            label="Genre"
            selectedTags={filter.genres}
            name="genre"
            edit
            options={genres}
            onSelect={(value) =>
              setFilter({ ...filter, genres: [...filter.genres, value] })
            }
            onRemove={(genre) =>
              setFilter({
                ...filter,
                genres: filter.genres.filter(
                  (currentGenre) => genre.id !== currentGenre.id,
                ),
              })
            }
          />
          <div className="mt-4 flex flex-col">
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
