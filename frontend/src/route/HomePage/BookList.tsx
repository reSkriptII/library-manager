import type { booksData } from "./type";

export function BookList({ books }: { books: booksData }) {
  return <div>{JSON.stringify(books)}</div>;
  // return (
  //   <div>
  //     {books.map((book) => {
  //       return (
  //         <div>
  //           <img alt="book cover" src={window.api + `book/${book.id}/cover`} />
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}
