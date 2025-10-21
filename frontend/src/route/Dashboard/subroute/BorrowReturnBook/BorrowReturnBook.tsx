import { useState } from "react";
import { BookData } from "./BookData.jsx";
import { UserData } from "./UserData.jsx";
import { Form } from "./Form.jsx";
import { SubmitButton } from "./SubmitButton.jsx";
import type { HandleFormDataChangeFunction, FormData } from "./type";

export function BorrowReturnBook() {
  const [formData, setFormData] = useState<FormData>({
    userId: 0,
    bookId: 0,
    isInvalid: false,
    borrowOrReturn: "borrow",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormDataChange: HandleFormDataChangeFunction = function (
    field,
    data,
  ) {
    setFormData({
      ...formData,
      [field]: data,
    });
  };

  return (
    <div className="flex justify-between gap-20 pr-12">
      <div className="w-2/5 pl-8">
        <h2 className="mt-16 mb-8 text-center text-4xl font-bold">
          {formData.borrowOrReturn === "borrow" ? "Borrow " : "Return"} Book
        </h2>
        {formData.isInvalid && (
          <p className="mx-auto w-fit border border-red-500 bg-red-300 px-4 py-2">
            Request Failed.
          </p>
        )}
        <Form data={formData} onChange={handleFormDataChange} />
        <SubmitButton
          data={formData}
          setInvalid={(invalid) => handleFormDataChange("isInvalid", invalid)}
          onSubmit={() => setRefreshKey(refreshKey + 1)}
        />
      </div>

      <div className="mt-8 w-3/5">
        <UserData userId={formData.userId} />
        <BookData bookId={Number(formData.bookId)} />
      </div>
    </div>
  );
}
