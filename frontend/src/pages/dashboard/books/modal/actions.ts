import { toast } from "sonner";
import {
  createBook,
  deleteBook,
  updateBook,
  updateBookCover,
} from "@/features/books/api.ts";
import type { BookData, BookPropEntity } from "@/features/books/type";
import type { BookModalEditor } from "./hooks/useEditor";

export function createActions(
  book: BookData | null,
  editor: BookModalEditor,
  save: () => void,
  closeModal: () => void,
) {
  function notify(
    res: { ok?: boolean; message?: string } | undefined,
    successMessage: string,
    errorPrefix: string,
  ) {
    if (res?.ok) {
      toast.success(successMessage);
    } else {
      toast.error(errorPrefix + (res?.message ?? "unknow error"));
    }
  }

  function saveAndCloseModal() {
    save();
    closeModal();
  }

  async function handleCreate() {
    const { title, genres, authors, coverImg } = editor;
    const res = await createBook(
      transformBookData({ title, genres, authors }),
      coverImg,
    );

    notify(res, "Successfully create book", "Error creating book: ");
    saveAndCloseModal();
  }

  async function handleDelete() {
    if (!book) return;

    const res = await deleteBook(book.id);

    notify(res, "Successfully delete book", "Error deleting book: ");
    saveAndCloseModal();
  }

  async function handleUpdateBook() {
    if (!book) return;
    if (!isBookDataChange(book, editor)) return;

    const { title, genres, authors } = editor;
    const bookUpdate = await updateBook(
      book.id,
      transformBookData({ title, genres, authors }),
    );
    if (!bookUpdate?.ok) {
      toast.error(bookUpdate?.message ?? "unknow error");
    }
  }

  async function handleUpdateCover() {
    if (!book || !editor.coverImg) return;

    const coverUpdate = await updateBookCover(book.id, editor.coverImg);
    if (!coverUpdate?.ok) {
      toast.error(coverUpdate?.message ?? "unknow error");
    }
  }

  async function handleSave() {
    if (editor.deleting) return await handleDelete();

    if (!editor.title) return toast("book title can't be empty");
    if (!book) return await handleCreate();

    await handleUpdateBook();
    await handleUpdateCover();

    save();
    editor.setEditing(false);
    toast.success("Saved");
  }

  return { handleSave };
}

// --------------- helper function ----------------

type ToTransform = {
  title: string;
  genres: BookPropEntity[];
  authors: BookPropEntity[];
};

function transformBookData({ title, genres, authors }: ToTransform) {
  return {
    title,
    genres: genres.map((genre) => genre.id),
    authors: authors.map((author) => author.id),
  };
}

function isBookDataChange(book: BookData | null, editor: BookModalEditor) {
  // simple check
  if (
    !book ||
    book.title !== editor.title ||
    book.genres.length !== editor.genres.length ||
    book.authors.length !== editor.authors.length
  )
    return true;

  // deep compare genres and authors by id at exact index position
  return (
    editor.genres.every(
      (genre, index) => genre.id !== book.genres[index]?.id,
    ) ||
    editor.authors.every(
      (author, index) => author.id === book.authors[index]?.id,
    )
  );
}
