import { useEffect } from "react";
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

import {
  TitleField,
  GenresField,
  AuthorsField,
  CoverImgDiv,
  CoverImgField,
  DeleteButton,
} from "./modalcomponents";
import type { BookData } from "@/features/books/type.ts";
import { useEditor, type BookModalEditor } from "./hooks/useEditor";
import { createActions } from "./actions";

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
  const editor = useEditor(book);
  const { handleSave } = createActions(book, editor, onSave, setClose);

  useEffect(() => {
    editor.reset();
  }, [book]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      editor.reset();
      setClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay />
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mr-8 flex justify-between">
            <DialogTitle className="text-2xl font-bold">
              {book ? "Edit Book" : "Create Book"}
            </DialogTitle>
            {editor.editing && <Pen />}
          </div>
          <DialogDescription className="sr-only">
            A form for {book ? "editing a book" : "creating a book"}
          </DialogDescription>
        </DialogHeader>
        <ModalBody book={book} editor={editor} />

        <DialogFooter>
          <ModalFooter
            book={book}
            editor={editor}
            setClose={setClose}
            handleSave={handleSave}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ModalBodyProps = { editor: BookModalEditor; book: BookData | null };

function ModalBody({ editor, book }: ModalBodyProps) {
  return (
    <>
      {editor.deleting && (
        <p className="flex gap-2 font-bold">
          <TriangleAlert /> This book will be deleted after save
        </p>
      )}

      <TitleField editor={editor} />

      <div className="flex justify-between gap-2">
        <div className="max-w-2/3">
          {editor.editing && <CoverImgField editor={editor} />}
          <GenresField editor={editor} />
          <AuthorsField editor={editor} />
          {editor.editing && book && <DeleteButton editor={editor} />}
        </div>

        <CoverImgDiv editor={editor} bookId={book?.id} />
      </div>
    </>
  );
}

type ModalFooterProps = {
  book: BookData | null;
  editor: BookModalEditor;
  setClose: () => void;
  handleSave: () => void;
};

function ModalFooter({ book, editor, setClose, handleSave }: ModalFooterProps) {
  if (editor.editing) {
    return (
      <>
        <div className="flex flex-row justify-end gap-2">
          <Button
            className="w-20"
            variant="outline"
            onClick={() => {
              editor.reset();
              if (book) editor.setEditing(false);
              else setClose();
            }}
          >
            Cancel
          </Button>
          <Button className="w-20" onClick={handleSave}>
            Save
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-end gap-2">
        <Button className="w-20" variant="outline" onClick={setClose}>
          Close
        </Button>
        <Button className="w-20" onClick={() => editor.setEditing(true)}>
          Edit
        </Button>
      </div>
    </>
  );
}
