import { useState } from "react";
import { FormInput } from "#component/FormInput.jsx";
export function Borrow() {
  const [borrowerId, setBorrowerId] = useState<number | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const [bookData, setBookData] = useState();

  return (
    <div className="flex justify-between gap-20 pr-12">
      <div className="w-2/5 pl-8">
        <h2 className="mt-16 mb-8 text-center text-4xl font-bold">
          Borrow Book
        </h2>
        <form>
          <FormInput
            label="Borrower ID:"
            type="number"
            onChange={(e) => {
              setBorrowerId(Number(e.target.value));
            }}
            value={borrowerId}
          />
          <FormInput
            label="Book ID:"
            type="number"
            onChange={(e) => {
              setBookId(Number(e.target.value));
            }}
            value={bookId}
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
        <div className="my-8 flex gap-4">
          <div className="h-72 w-1/2 bg-neutral-300">
            <img className="m-auto max-h-full max-w-full" src="/search.svg" />
          </div>
          <div className="w-1/2">
            <p className="font-bold">Book title:</p>
            <p className="mb-4 ml-2 text-2xl">Book</p>
            <p className="font-bold">Author:</p>
            <p className="mb-4 ml-2 text-2xl">Name</p>
            <p className="font-bold">Genre:</p>
            <p className="mb-4 ml-2 text-2xl">Textbook</p>
          </div>
        </div>
      </div>
    </div>
  );
}
