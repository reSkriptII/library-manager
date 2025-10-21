import axios from "axios";
import type { FormData } from "./type";

type props = {
  data: FormData;
  setInvalid: (invalid: boolean) => void;
  onSubmit: () => void;
};
export function SubmitButton({ data, setInvalid, onSubmit }: props) {
  const { bookId, userId, borrowOrReturn } = data;

  async function handleClick(e: any) {
    e.preventDefault();
    onSubmit();

    try {
      if (!bookId && !userId) {
        setInvalid(true);
        return;
      }

      if (borrowOrReturn === "borrow") {
        await axios.post(
          window.api + "/lib/borrow",
          { bookId, userId },
          { withCredentials: true },
        );
        setInvalid(false);
      } else if (borrowOrReturn === "return") {
        await axios.post(
          window.api + "/lib/return",
          { bookId, userId },
          { withCredentials: true },
        );
        setInvalid(false);
      }
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setInvalid(true);
      }
      console.log(err);
    }
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
