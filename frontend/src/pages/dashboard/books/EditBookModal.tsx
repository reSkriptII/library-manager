import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Pen, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import {
  createBook,
  deleteBook,
  updateBook,
  updateBookCover,
} from "@/features/books/api.ts";
import {
  TitleField,
  GenresField,
  AuthorsField,
  CoverImgDiv,
  CoverImgField,
  DeleteButton,
} from "./modalcomponents";
import type { BookPropEntity } from "@/features/books/type.ts";
import type { BookData } from "@/features/books/type.ts";

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

  function resetEditor() {
    setDeleting(false);
    setTitle(book?.title ?? "");
    setGenres(book?.genres ?? []);
    setAuthors(book?.authors ?? []);
    setCoverImg(undefined);
    setEditing(!book);
  }

  useEffect(() => {
    resetEditor();
  }, [book]);

  async function handleCreate() {
    const res = await createBook(transformBookData({ title, genres, authors }));
    if (res?.ok) {
      toast.success("Successfully create book");
    } else {
      toast.error("Error creating book: " + (res?.message ?? "unknow error"));
    }

    onSave();
    return setClose();
  }

  async function handleDelete() {
    if (!book) return;

    const res = await deleteBook(book.id);
    if (res?.ok) {
      toast.success("Successfully delete book");
    } else {
      toast.error("Error deleting book: " + (res?.message ?? "unknow error"));
    }

    onSave();
    return setClose();
  }

  async function handleUpdateBook() {
    if (
      !book ||
      book.title != title ||
      genres.every((genre, index) => genre.id === book.genres[index]?.id) ||
      authors.every((author, index) => author.id === book.authors[index]?.id)
    )
      return;

    const bookUpdate = await updateBook(
      book.id,
      transformBookData({ title, genres, authors }),
    );
    if (!bookUpdate?.ok) {
      toast.error(bookUpdate?.message ?? "unknow error");
      onSave();
      return setEditing(false);
    }
  }

  async function handleUpdateCover() {
    if (!book || !coverImg) return;

    const coverUpdate = await updateBookCover(book.id, coverImg);
    if (!coverUpdate?.ok) {
      toast.error(coverUpdate?.message ?? "unknow error");
      onSave();
      return setEditing(false);
    }
  }

  async function handleSave() {
    if (!book) return await handleCreate();

    if (deleting) return await handleDelete();

    await handleUpdateBook();
    await handleUpdateCover();

    onSave();
    setEditing(false);
    toast.success("Saved");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetEditor();
          setClose();
        }
      }}
    >
      <DialogOverlay />

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mr-8 flex justify-between">
            <DialogTitle className="text-2xl font-bold">
              {book ? "Edit Book" : "Create Book"}
            </DialogTitle>
            {editing && <Pen />}
          </div>
          <DialogDescription className="sr-only">
            A form for {book ? "editing a book" : "creating a book"}
          </DialogDescription>
        </DialogHeader>

        {deleting && (
          <p className="flex gap-2 font-bold">
            <TriangleAlert /> This book will be deleted after save
          </p>
        )}

        <TitleField
          edit={editing}
          value={title}
          onChange={(t) => setTitle(t)}
        />
        <div className="flex justify-between gap-2">
          <div className="max-w-2/3">
            {editing && <CoverImgField onChange={(img) => setCoverImg(img)} />}
            <GenresField
              edit={editing}
              selected={genres}
              setField={setGenres}
            />
            <AuthorsField
              edit={editing}
              selected={authors}
              setField={setAuthors}
            />
            {editing && book && (
              <DeleteButton deleting={deleting} setDeleting={setDeleting} />
            )}
          </div>
          <CoverImgDiv
            edit={editing}
            bookId={book?.id}
            changingImg={coverImg}
          />
        </div>
        <DialogFooter>
          {editing ? (
            <div className="flex flex-row justify-end gap-2">
              <Button
                className="w-20"
                variant="outline"
                onClick={() => {
                  resetEditor();
                  if (book) setEditing(false);
                  else setClose();
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

type ToTransForm = {
  title: string;
  genres: BookPropEntity[];
  authors: BookPropEntity[];
};

function transformBookData({ title, genres, authors }: ToTransForm) {
  return {
    title,
    genres: genres.map((genre) => genre.id),
    authors: authors.map((author) => author.id),
  };
}
