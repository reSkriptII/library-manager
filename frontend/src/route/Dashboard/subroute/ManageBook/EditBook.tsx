import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { bookData } from "./type";
import { Dot } from "#root/component/etc/Dot.tsx";
import { Search } from "./Search";

export function EditBook() {
  const { id } = useParams() as { id: string };
  const [book, setBook] = useState<bookData | null>(null);
  const [showAddGenre, setShowAddGenre] = useState(false);
  const [showAddAuthor, setShowAddAuthor] = useState(false);
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

  function bookPropBoxes(
    data: string[] | null,
    handleDelete: (deleteData: string) => void,
  ) {
    if (data == null) return;
    return (
      <>
        {data.map((value: string) => {
          return (
            <div
              className="flex w-fit gap-2 rounded-md bg-neutral-200 px-2 py-1"
              key={value}
            >
              {value}
              <button onClick={() => handleDelete(value)}>x</button>
            </div>
          );
        })}
      </>
    );
  }

  async function handleRemoveGenre(deleteValue: string) {
    if (book == null) return;
    try {
      await axios.delete(window.api + `/book/${id}/genre/${deleteValue}`, {
        withCredentials: true,
      });
      //TODO: reload book data
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveAuthor(deleteValue: string) {
    if (book == null) return;
    await axios.delete(window.api + `/book/${id}/author/${deleteValue}`, {
      withCredentials: true,
    });
  }
  async function handleAddGenre(genre: string) {
    try {
      await axios.post(window.api + `/book/${id}/genre/${genre}`, null, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddAuthor(author: string) {
    try {
      await axios.post(window.api + `/book/${id}/author/${author}`, null, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
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
              <div className="relative flex gap-2 pl-4">
                {bookPropBoxes(book.genres, handleRemoveGenre)}
                <button
                  className="px-2 text-2xl"
                  onClick={() => setShowAddGenre(!showAddGenre)}
                >
                  +
                </button>
                <Search
                  hidden={!showAddGenre}
                  onSelect={handleAddGenre}
                  excludes={book.genres ?? []}
                  searchPath={window.api + "/book/genres"}
                  createValuePath={window.api + "/admin/creategenre"}
                  createValueBody={(genre) => ({ genre })}
                />
              </div>
            </div>
            <div>
              <p className="text-2xl">Author: </p>
              <div className="relative flex gap-2 pl-4">
                {bookPropBoxes(book.authors, handleRemoveAuthor)}
                <button
                  className="px-2 text-2xl"
                  onClick={() => setShowAddAuthor(!showAddAuthor)}
                >
                  +
                </button>
                <Search
                  hidden={!showAddAuthor}
                  onSelect={handleAddAuthor}
                  excludes={book.genres ?? []}
                  searchPath={window.api + "/book/authors"}
                  createValuePath={window.api + "/admin/createauthor"}
                  createValueBody={(author) => ({ author })}
                />
              </div>
            </div>
            <div>
              <p className="text-2xl">Series: </p>
              <p className="mb-6 pl-6 text-xl">{book.series ?? "N/A"}</p>
            </div>
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
