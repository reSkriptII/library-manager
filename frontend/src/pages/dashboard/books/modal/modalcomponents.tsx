import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { TagListSelect } from "@/components/tagsselect.tsx";
import {
  useGenres,
  useAuthors,
} from "@/features/books/hooks.ts/useBookProps.ts";
import { API_BASE_URL } from "@/env.ts";
import type { BookModalEditor } from "./hooks/useEditor";
import { useContext } from "react";
import { ThemeProviderContext } from "@/contexts/ThemeContext";
import { createAuthor, createGenre } from "@/features/books/api";
import { toast } from "sonner";

type BookModalComponentProps = { editor: BookModalEditor };
export function TitleField({ editor }: BookModalComponentProps) {
  const { editing, title, setTitle } = editor;
  return (
    <div>
      <Label className="text-base font-normal" htmlFor="title">
        Title
      </Label>
      <Input
        id="title"
        type="text"
        readOnly={!editing}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}

export function CoverImgField({ editor }: BookModalComponentProps) {
  const { setCoverImg } = editor;
  return (
    <div>
      <Label htmlFor="coverimage">Cover image</Label>
      <Input
        id="coverimage"
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImg(e.target.files?.[0])}
      />
    </div>
  );
}

export function GenresField({ editor }: BookModalComponentProps) {
  const { editing, genres, setGenres } = editor;
  const genreList = useGenres();

  async function handleCreateGenre(value: string) {
    const res = await createGenre(value);
    if (!res?.ok) {
      return toast.error(
        "error creating genre: " + (res?.message ?? "unknow error"),
      );
    }

    toast.success("created genre successfully");
    editor.setGenres([...editor.genres, res.genre]);
  }

  return (
    <TagListSelect
      label="Genre"
      selectedTags={genres}
      name="genre"
      edit={editing}
      options={genreList}
      onSelect={(genre) => setGenres([...genres, genre])}
      onRemove={(genre) =>
        setGenres(genres.filter((currentGenre) => genre.id !== currentGenre.id))
      }
      onCreate={handleCreateGenre}
    />
  );
}

export function AuthorsField({ editor }: BookModalComponentProps) {
  const { editing, authors, setAuthors } = editor;
  const authorList = useAuthors();
  async function handleCreateAuthor(value: string) {
    const res = await createAuthor(value);
    if (!res?.ok) {
      return toast.error(
        "error creating author: " + (res?.message ?? "unknow error"),
      );
    }
  }
  return (
    <TagListSelect
      label="Author"
      selectedTags={authors}
      name="author"
      edit={editing}
      options={authorList}
      onSelect={(author) => setAuthors([...authors, author])}
      onRemove={(author) =>
        setAuthors(
          authors.filter((currentAuthor) => author.id !== currentAuthor.id),
        )
      }
      onCreate={handleCreateAuthor}
    />
  );
}

export function DeleteButton({ editor }: BookModalComponentProps) {
  const { deleting, setDeleting } = editor;
  return (
    <Button
      className="mt-4 w-32"
      variant={deleting ? "outline" : "default"}
      onClick={() => setDeleting(!deleting)}
    >
      {deleting ? "Cancel Delete" : "Delete Book"}
    </Button>
  );
}

type CoverImgDivProps = { editor: BookModalEditor; bookId?: number };

export function CoverImgDiv({ editor, bookId }: CoverImgDivProps) {
  const { theme } = useContext(ThemeProviderContext);

  return (
    <div className="flex size-52 items-center justify-center">
      <img
        src={
          editor.editing && editor.coverImg
            ? URL.createObjectURL(editor.coverImg)
            : API_BASE_URL + `/books/${bookId}/cover`
        }
        className="max-h-full max-w-full"
        alt="cover image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = theme === "dark" ? "/book-dark.svg" : "/book.svg";
        }}
      />
    </div>
  );
}
