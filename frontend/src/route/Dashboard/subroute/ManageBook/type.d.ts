export type booksSearchOption = {
  data: string;
  searchField: "title" | "author" | "genre";
  availableOnly: boolean;
};
export type bookData = {
  id: number;
  title: string;
  authors: string[];
  genres: string[];
  series: string;
  available: boolean;
  reserveQueue: number;
};
