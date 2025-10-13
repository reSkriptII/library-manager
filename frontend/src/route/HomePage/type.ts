export type booksSearchField = "title" | "author" | "genre";

export type booksSearchOption = {
  data: string;
  searchField: booksSearchField;
  availableOnly: boolean;
};
