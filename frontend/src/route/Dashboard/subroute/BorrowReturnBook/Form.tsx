import { FormInput } from "#root/component/FormInput.jsx";
import type { HandleFormDataChangeFunction, FormData } from "./type.js";

export function Form({
  data,
  onChange,
}: {
  data: FormData;
  onChange: HandleFormDataChangeFunction;
}) {
  return (
    <form className="pl-6">
      <FormInput
        label={
          data.borrowOrReturn === "borrow" ? "Borrower ID:" : "Returner ID:"
        }
        type="number"
        onChange={(e) => {
          onChange("userId", Number(e.target.value));
        }}
        min={0}
        value={data.userId}
        required
      />
      <FormInput
        label="Book ID:"
        type="number"
        onChange={(e) => {
          onChange("bookId", Number(e.target.value));
        }}
        value={data.bookId}
        min={0}
        required
      />
      <label className="flex justify-start gap-1 text-lg">
        <input
          type="radio"
          name="borrow-return"
          value="borrow"
          checked={data.borrowOrReturn === "borrow"}
          onChange={() => onChange("borrowOrReturn", "borrow")}
        />
        Borrow
      </label>
      <label className="flex justify-start gap-1 text-lg">
        <input
          type="radio"
          name="borrow-return"
          value="return"
          checked={data.borrowOrReturn === "return"}
          onChange={() => onChange("borrowOrReturn", "return")}
        />
        Return
      </label>
    </form>
  );
}
