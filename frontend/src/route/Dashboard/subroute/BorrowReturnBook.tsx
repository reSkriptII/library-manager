import { useState, useEffect } from "react";
import axios from "axios";
import { FormInput } from "#component/FormInput.jsx";
import type { bookData } from "./type";

export function BorrowReturnBook() {
  const [borrowOrReturn, setBorrowOrReturn] = useState<"borrow" | "return">(
    "borrow",
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);

  return (
    <div className="flex justify-between gap-20 pr-12">
      <div className="w-2/5 pl-8">
        <h2 className="mt-16 mb-8 text-center text-4xl font-bold">
          {borrowOrReturn === "borrow" ? "Borrow " : "Return"} Book
        </h2>
        <form className="pl-6">
          <FormInput
            label="Borrower ID:"
            type="number"
            onChange={(e) => {
              setUserId(Number(e.target.value));
            }}
            value={userId ?? ""}
          />
          <FormInput
            label="Book ID:"
            type="number"
            onChange={(e) => {
              setBookId(Number(e.target.value));
            }}
            value={bookId ?? ""}
          />
          <label className="flex justify-start gap-1 text-lg">
            <input
              type="radio"
              name="borrow-return"
              value="borrow"
              checked={borrowOrReturn === "borrow"}
              onChange={() => setBorrowOrReturn("borrow")}
            />
            Borrow
          </label>
          <label className="flex justify-start gap-1 text-lg">
            <input
              type="radio"
              name="borrow-return"
              value="return"
              checked={borrowOrReturn === "return"}
              onChange={() => setBorrowOrReturn("return")}
            />
            Return
          </label>
          <SubmitButton
            borrowOrReturn={borrowOrReturn}
            bookId={bookId}
            userId={userId}
          />
        </form>
      </div>
      <div className="mt-8 w-3/5">
        <div className="my-8 flex gap-4">
          <div className="w-1/2">
            <img
              className="mx-auto block size-32 rounded-full"
              src="/profile.svg"
            />
          </div>
          <div className="w-1/2">
            <p className="font-bold">Name:</p>
            <p className="mb-4 ml-2 text-2xl">Name</p>
            <p className="font-bold">Email:</p>
            <p className="mb-4 ml-2 text-2xl">email</p>
          </div>
        </div>
        <BookOverView bookId={Number(bookId)} />
      </div>
    </div>
  );
}

type SubmitButtonProps = {
  borrowOrReturn: "borrow" | "return";
  bookId: number | null;
  userId: number | null;
};

function SubmitButton({ borrowOrReturn, bookId, userId }: SubmitButtonProps) {
  function handleClick(e: any) {
    e.preventDefault();
    async function submit() {
      try {
        if (borrowOrReturn === "borrow") {
          await axios.post(
            window.api + "/lib/borrow",
            { bookId, userId },
            { withCredentials: true },
          );
        } else if (borrowOrReturn === "return") {
          await axios.post(
            window.api + "/lib/borrow",
            { bookId, userId },
            { withCredentials: true },
          );
        }
      } catch (err) {
        //TOOD: notificate error
        console.log(err);
      }
    }
    submit();
  }
  return (
    <button
      className="mx-auto mt-8 block w-72 border border-black py-2.5 text-xl shadow shadow-neutral-500 active:shadow-none"
      onClick={handleClick}
    >
      Submit book {borrowOrReturn}ing
    </button>
  );
}

function UserOverView({ userId }: { userId: number | null }) {}

function BookOverView({ bookId }: { bookId: number | null }) {
  const [bookData, setBookData] = useState<bookData | null>(null);
  useEffect(() => {
    let isMount = true;
    const getBook = async () => {
      if (bookId != null) {
        try {
          const bookResult = await axios.get(window.api + "/book/" + bookId);
          if (isMount) {
            setBookData(bookResult.data.data);
          }
        } catch (err) {
          if (err instanceof axios.AxiosError && err.status == 404) {
            if (isMount) {
              setBookData(null);
            }
          }
        }
      }
    };

    getBook();
    return () => {
      isMount = false;
    };
  }, [bookId]);

  const imgSrc =
    bookData == null
      ? "/search.svg"
      : window.api + `/book/${bookData?.id}/cover`;

  return (
    <div className="my-8 flex gap-4">
      <div className="flex h-72 w-1/2 items-center justify-center">
        <img className="m-auto max-h-full max-w-full" src={imgSrc} />
      </div>
      <div className="w-1/2">
        <p className="font-bold">Book title:</p>
        <p className="mb-4 ml-2 text-2xl">{bookData?.title ?? "N/A"}</p>
        <p className="font-bold">Author:</p>
        <p className="mb-4 ml-2 text-2xl">
          {bookData?.authors?.join(", ") ?? "N/A"}
        </p>
        <p className="font-bold">Genre:</p>
        <p className="mb-4 ml-2 text-2xl">
          {bookData?.genres?.join(", ") ?? "N/A"}
        </p>
        {!bookData?.available && (
          <p className="mb-4 text-2xl">
            This book is
            {bookData?.reserveQueue !== 0 ? " reserved" : " unavailable"}
          </p>
        )}
      </div>
    </div>
  );
}
