export type booksSearchOption = {
  data: string;
  searchField: "title" | "author" | "genre";
  availableOnly: boolean;
};

export type booksData = {
  id: number;
  title: string;
  author: string;
  available: boolean;
}[];
