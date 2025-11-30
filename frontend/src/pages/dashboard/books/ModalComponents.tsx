import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { TagListSelect } from "@/components/tagsselect.tsx";
import {
  useGenres,
  useAuthors,
} from "@/features/books/hooks.ts/useBookProps.ts";
import { API_BASE_URL } from "@/env.ts";
import type { BookPropEntity } from "@/features/books/type.ts";

type TitleFieldProp = {
  edit: boolean;
  value: string;
  onChange: (title: string) => void;
};

export function TitleField({ edit, value, onChange }: TitleFieldProp) {
  return (
    <div>
      <Label className="text-base font-normal">Title</Label>
      <Input
        id="title"
        type="text"
        readOnly={!edit}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type CoverImgFieldProps = { onChange: (img: File | undefined) => void };

export function CoverImgField({ onChange }: CoverImgFieldProps) {
  return (
    <div>
      <Label>Cover image</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </div>
  );
}

type PropFieldProps = {
  edit: boolean;
  selected: BookPropEntity[];
  setField: (value: BookPropEntity[]) => void;
};

export function GenresField({ edit, selected, setField }: PropFieldProps) {
  const genreList = useGenres();
  return (
    <TagListSelect
      label="Genre"
      selectedTags={selected}
      name="genre"
      edit={edit}
      options={genreList}
      onSelect={(genre) => setField([...selected, genre])}
      onRemove={(genre) =>
        setField(
          selected.filter((currentGenre) => genre.id !== currentGenre.id),
        )
      }
    />
  );
}

export function AuthorsField({ edit, selected, setField }: PropFieldProps) {
  const authorList = useAuthors();
  return (
    <TagListSelect
      label="Author"
      selectedTags={selected}
      name="author"
      edit={edit}
      options={authorList}
      onSelect={(author) => setField([...selected, author])}
      onRemove={(author) =>
        setField(
          selected.filter((currentAuthor) => author.id !== currentAuthor.id),
        )
      }
    />
  );
}

type DeleteButtonProps = {
  deleting: boolean;
  setDeleting: (deleting: boolean) => void;
};

export function DeleteButton({ deleting, setDeleting }: DeleteButtonProps) {
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

type CoverImgDivProps = { edit: boolean; bookId?: number; changingImg?: File };

export function CoverImgDiv({ edit, bookId, changingImg }: CoverImgDivProps) {
  return (
    <div className="flex size-52 items-center justify-center">
      <img
        src={
          edit && changingImg
            ? URL.createObjectURL(changingImg)
            : API_BASE_URL + `/books/${bookId}/cover`
        }
        className="max-h-full max-w-full"
        alt="cover image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/book.svg";
        }}
      />
    </div>
  );
}
