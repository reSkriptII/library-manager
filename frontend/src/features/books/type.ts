export type BookPropEntity = { id: number; name: string };

export type BookData = {
  id: number;
  title: string;
  genres: BookPropEntity[];
  authors: BookPropEntity[];
  lent: boolean;
  reserveQueue: number;
};

export type BookFilter = {
  title: string;
  genres: BookPropEntity[];
  author: BookPropEntity | null;
};
