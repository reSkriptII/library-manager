import { useState } from "react";
import type { BookData, BookPropEntity } from "@/features/books/type";

export type BookModalEditor = {
  editing: boolean;
  setEditing: (editing: boolean) => void;

  title: string;
  setTitle: (title: string) => void;

  genres: BookPropEntity[];
  setGenres: (genres: BookPropEntity[]) => void;

  authors: BookPropEntity[];
  setAuthors: (authors: BookPropEntity[]) => void;

  coverImg: File | undefined;
  setCoverImg: (img: File | undefined) => void;

  deleting: boolean;
  setDeleting: (deleting: boolean) => void;

  reset: () => void;
};

export function useEditor(book: BookData | null): BookModalEditor {
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

  return {
    editing,
    setEditing,

    title,
    setTitle,

    genres,
    setGenres,

    authors,
    setAuthors,

    coverImg,
    setCoverImg,

    deleting,
    setDeleting,

    reset: resetEditor,
  };
}
