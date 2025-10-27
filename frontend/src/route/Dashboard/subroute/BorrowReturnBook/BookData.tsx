import axios from "axios";
import { useState, useEffect } from "react";
import type { bookData } from "../type";

export function BookData({ bookId }: { bookId: number | null }) {
  const [bookData, setBookData] = useState<bookData | null>(null);
  useEffect(() => {
    let isMount = true;
    (async () => {
      if (bookId == null) return;
      try {
        const bookResult = await axios.get(window.api + "/book/" + bookId);
        if (isMount) setBookData(bookResult.data.data);
      } catch (err) {
        if (err instanceof axios.AxiosError && err.status == 404) {
          if (isMount) setBookData(null);
        }
      }
    })();

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
        {bookData && !bookData.available && (
          <p className="mb-4 text-2xl">
            This book is
            {bookData?.reserveQueue ? " reserved" : " unavailable"}
          </p>
        )}
      </div>
    </div>
  );
}
