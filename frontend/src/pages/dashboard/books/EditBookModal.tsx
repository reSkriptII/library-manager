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
import { Pen } from "lucide-react";
import { updateBook } from "#root/features/books/api.ts";
import { toast } from "sonner";
type EditBookModalProps = {
  open: boolean;
  book: BookData | null;
  onClose: () => void;
  onSave: () => void;
};

export function EditBookModal({
  open,
  book,
  onClose,
  onSave,
}: EditBookModalProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book?.title ?? "no book");
  const [genres, setGenres] = useState<BookPropEntity[]>(book?.genres ?? []);
  const [authors, setAuthors] = useState<BookPropEntity[]>(book?.authors ?? []);
  const genreList = useGenres();
  const authorList = useAuthors();

  function resetEditor() {
    if (book) {
      setEditing(false);
      setTitle(book.title);
      setGenres(book.genres);
      setAuthors(book.authors);
    }
  }

  useEffect(() => {
    resetEditor();
  }, [book]);

  async function handleSave() {
    if (!book) return toast.error("no book to edit");
    const res = await updateBook(book.id, {
      title,
      genres: genres.map((genre) => genre.id),
      authors: authors.map((author) => author.id),
    });
    if (res?.ok) {
      toast.success("Saved");
    } else {
      toast.error(res?.message ?? "unknow error");
    }
    setEditing(false);
    onSave();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogOverlay />

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mr-8 flex justify-between">
            <DialogTitle className="text-2xl font-bold">Edit book</DialogTitle>
            {editing && <Pen color="#0e1" />}
          </div>
        </DialogHeader>
        <div>
          <Label className="text-base font-normal">Title</Label>
          <Input
            id="title"
            type="text"
            readOnly={!editing}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={false}
          />
        </div>
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
              authors.filter((currentGenre) => genre.id !== currentGenre.id),
            )
          }
        />
        <DialogFooter>
          {editing ? (
            <>
              <Button
                className="w-20"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button className="w-20" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button className="w-20" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="w-20" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
