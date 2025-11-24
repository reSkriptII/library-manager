export type BookPropEntity = { id: number; name: string };

export type BookData = {
  id: number;
  title: string;
  genres: {
    id: number;
    name: string;
  }[];
  authors: {
    id: number;
    name: string;
  }[];
  lent: boolean;
  reserveQueue: number;
};

type SearchBookProps = {
  filter: BookFilter;
  setFilter: (books: BookFilter) => void;
};
