import { FormInput } from "#root/component/FormInput.jsx";
import axios from "axios";
import { useState } from "react";
import { SelectSearch } from "./SelectSearch.jsx";

export function AddBook() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [coverImg, setCoverImg] = useState<File | null>(null);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("bookData", JSON.stringify({ title, authors, genres }));
    if (coverImg) formData.append("coverimg", coverImg);
    try {
      await axios.post(window.api + "/book", formData, {
        withCredentials: true,
      });
      alert("success");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <h1>Add book</h1>
      <div>
        <FormInput
          label="Book title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <SelectSearch
          label="author:"
          values={authors}
          onChange={setAuthors}
          searchPath={window.api + "/book/authors"}
          createValuePath={window.api + "/admin/createauthor"}
          createValueBody={(author) => {
            return { author };
          }}
        />
        <SelectSearch
          label="genre:"
          values={genres}
          onChange={setGenres}
          searchPath={window.api + "/book/genres"}
          createValuePath={window.api + "/admin/creategenre"}
          createValueBody={(genre) => {
            return { genre };
          }}
        />
        <CoverImgInput label="cover image:" onChange={setCoverImg} />
        <button
          onClick={handleSubmit}
          className="mx-auto mt-12 block border border-black px-6 py-2 shadow shadow-neutral-500"
        >
          Add book
        </button>
      </div>
    </div>
  );
}

type CoverImgInputProps = {
  label: string;
  onChange: (file: File | null) => void;
};

function CoverImgInput({ label, onChange }: CoverImgInputProps) {
  return (
    <label>
      {label}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="border border-black p-2 file:border file:border-black file:bg-neutral-100 file:p-2"
      />
    </label>
  );
}
