import axios from "axios";

export function ReserveButton({ bookId }: { bookId: string }) {
  async function handleClick() {
    try {
      await axios.post(
        window.api + "/book/reserve",
        { bookId },
        { withCredentials: true },
      );
      window.location.reload();

      //TODO: notification
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="m-auto w-fit border border-black px-6 py-2 text-2xl shadow shadow-neutral-400 active:shadow-none"
    >
      Reserve this book
    </button>
  );
}
