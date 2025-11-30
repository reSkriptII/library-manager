import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "#root/components/ui/dialog.tsx";
import { Input } from "#root/components/ui/input.tsx";
import type { BookData } from "#root/features/books/type.ts";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import type { BookPropEntity } from "#root/features/books/type.ts";
import { TagListSelect } from "#root/components/tagsselect.tsx";
import {
  useAuthors,
  useGenres,
} from "#root/features/books/hooks.ts/useBookProps.ts";
import { Button } from "#root/components/ui/button.tsx";
import { Pen, TriangleAlert } from "lucide-react";
import {
  deleteBook,
  updateBook,
  updateBookCover,
} from "#root/features/books/api.ts";
import { toast } from "sonner";
import { API_BASE_URL } from "#root/env.ts";
type EditBookModalProps = {
  open: boolean;
  book: BookData | null;
  setClose: () => void;
  onSave: () => void;
};

export function EditBookModal({
  open,
  book,
  setClose,
  onSave,
}: EditBookModalProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book?.title ?? "no book");
  const [genres, setGenres] = useState<BookPropEntity[]>(book?.genres ?? []);
  const [authors, setAuthors] = useState<BookPropEntity[]>(book?.authors ?? []);
  const [coverImg, setCoverImg] = useState<File>();
  const [deleting, setDeleting] = useState(false);
  const genreList = useGenres();
  const authorList = useAuthors();

  const newCoverUrl = coverImg && URL.createObjectURL(coverImg);
  function resetEditor() {
    if (book) {
      setEditing(false);
      setDeleting(false);
      setTitle(book.title);
      setGenres(book.genres);
      setAuthors(book.authors);
      setCoverImg(undefined);
    }
  }

  useEffect(() => {
    resetEditor();
  }, [book]);

  async function handleSave() {
    if (!book) return toast.error("no book to edit");

    if (deleting) {
      const res = await deleteBook(book.id);
      if (res?.ok) {
        toast.success("Successfully delete book");
      } else {
        console.log(res?.message);
        toast.error("Error deleting book: " + (res?.message ?? "unknow error"));
      }
      onSave();
      return setClose();
    }

    const bookUpdate = await updateBook(book.id, {
      title,
      genres: genres.map((genre) => genre.id),
      authors: authors.map((author) => author.id),
    });
    if (!bookUpdate?.ok) {
      toast.error(bookUpdate?.message ?? "unknow error");
      onSave();
      return setEditing(false);
    }

    if (coverImg) {
      const coverUpdate = await updateBookCover(book.id, coverImg);
      if (!coverUpdate?.ok) {
        toast.error(coverUpdate?.message ?? "unknow error");
        onSave();
        return setEditing(false);
      }
    }

    onSave();
    setEditing(false);
    toast.success("Saved");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setClose();
      }}
    >
      <DialogOverlay />

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mr-8 flex justify-between">
            <DialogTitle className="text-2xl font-bold">Edit book</DialogTitle>
            {editing && <Pen />}
          </div>
        </DialogHeader>
        {deleting && (
          <p className="flex gap-2 font-bold">
            <TriangleAlert /> This book will be deleted on save
          </p>
        )}
        <div>
          <Label className="text-base font-normal">Title</Label>
          <Input
            id="title"
            type="text"
            readOnly={!editing}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex">
          <div>
            {editing && (
              <div>
                <Label>Cover image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImg(e.target.files?.[0])}
                />
              </div>
            )}

            <TagListSelect
              label="Genre"
              selectedTags={genres}
              name="genre"
              edit={editing}
              options={genreList}
              onSelect={(value) => setGenres([...genres, value])}
              onRemove={(genre) =>
                setGenres(
                  genres.filter((currentGenre) => genre.id !== currentGenre.id),
                )
              }
            />
            <TagListSelect
              label="Author"
              selectedTags={authors}
              name="author"
              edit={editing}
              options={authorList}
              onSelect={(value) => setAuthors([...authors, value])}
              onRemove={(genre) =>
                setAuthors(
                  authors.filter(
                    (currentGenre) => genre.id !== currentGenre.id,
                  ),
                )
              }
            />
            {editing && (
              <Button
                className="mt-4 w-32"
                variant={deleting ? "outline" : "default"}
                onClick={() => setDeleting(!deleting)}
              >
                {deleting ? "Cancel Delete" : "Delete Book"}
              </Button>
            )}
          </div>
          <div className="flex size-52 items-center justify-center">
            <img
              src={
                editing && coverImg
                  ? newCoverUrl
                  : API_BASE_URL + `/books/${book?.id}/cover`
              }
              className="max-h-full max-w-full"
              alt="cover image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/book.svg";
              }}
            />
          </div>
        </div>
        <DialogFooter>
          {editing ? (
            <div className="flex flex-row justify-end gap-2">
              <Button
                className="w-20"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  resetEditor();
                }}
              >
                Cancel
              </Button>
              <Button className="w-20" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <div className="flex flex-row justify-end gap-2">
              <Button className="w-20" variant="outline" onClick={setClose}>
                Close
              </Button>
              <Button className="w-20" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
