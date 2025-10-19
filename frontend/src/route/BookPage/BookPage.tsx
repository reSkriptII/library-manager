import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { HeaderBar } from "#component/HeaderBar/HeaderBar.jsx";
import { Dot } from "#component/etc/Dot.js";
import { ReserveButton } from "./ReserveButton.jsx";
import type { bookData } from "./type";

export function BookPage() {
  const { id } = useParams() as { id: string };
  const [book, setBook] = useState<bookData | null>(null);
  console.log(book);

  useEffect(() => {
    const getBook = async () => {
      const bookResult = await axios.get(window.api + "/book/" + id);
      setBook(bookResult.data.data);
    };

    getBook();
  }, [id]);
  if (book == undefined) {
    return <div>Not found</div>;
  }

  function bookPropBoxes(data: string[]) {
    return (
      <div className="flex gap-2 pl-4">
        {data.map((genre: string) => {
          return (
            <div className="rounded-md bg-neutral-200 px-2 py-1" key={genre}>
              {genre}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <HeaderBar />
      <div className="mx-auto my-4 grid max-w-screen-xl grid-cols-2 justify-around px-8">
        <div>
          <div className="my-8 text-center">
            <h2 className="pb-2 text-4xl font-bold">{book.title}</h2>
            <p className="text-xl text-neutral-500">
              <Dot
                className="relative bottom-0.5 inline size-5"
                fill={book.available ? "lime" : "red"}
              />
              {book.available ? " available" : " not available"}
            </p>
          </div>
          <hr />
          <div className="m-auto flex max-w-96 flex-col gap-4 py-8">
            <div>
              <p className="text-2xl">Genre: </p>
              {bookPropBoxes(book.genres)}
            </div>
            <div>
              <p className="text-2xl">Author: </p>
              {bookPropBoxes(book.authors)}
            </div>
            <div>
              <p className="text-2xl">Series: </p>
              <p className="mb-6 pl-6 text-xl">{book.series ?? "N/A"}</p>
            </div>
            <ReserveButton bookId={id} />
            <p className="text-sm">reserve queue: {" " + book.reserveQueue}</p>
          </div>
        </div>

        <div className="my-4 flex h-118 items-center justify-center">
          <img
            src={window.api + `/book/${id}/cover`}
            className="aspect-auto max-h-full max-w-full"
          />
        </div>
      </div>
    </>
  );
}
