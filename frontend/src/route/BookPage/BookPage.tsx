import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { HeaderBar } from "../../component/HeaderBar/HeaderBar";
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

function ReserveButton({ bookId }: { bookId: string }) {
  return (
    <button className="m-auto w-fit border border-black px-6 py-2 text-2xl shadow shadow-neutral-400 active:shadow-none">
      Reserve this book
    </button>
  );
}

function Dot({ className, fill }: { className: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill={fill} />
    </svg>
  );
}
