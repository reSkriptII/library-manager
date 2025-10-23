import { FormInput } from "#root/component/FormInput.tsx";
import { useDebounce } from "#root/hook/useDebounce.ts";
import axios from "axios";
import { useEffect, useState } from "react";

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
      await axios.post(window.api + "/admin/addbook", formData, {
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
        />
        <SelectSearch
          label="genre:"
          values={genres}
          onChange={setGenres}
          searchPath={window.api + "/book/genres"}
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

type SelectSearchProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  searchPath: string;
};

function SelectSearch({
  label,
  values,
  onChange,
  searchPath,
}: SelectSearchProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="my-4">
      <p>{label}</p>
      <ul className="relative flex items-center gap-2 bg-neutral-200 px-4 py-2">
        {values.map((value) => {
          return (
            <li className="flex gap-4 bg-white px-4 py-2" key={value}>
              {value}
              <span>x</span>
            </li>
          );
        })}
        <li>
          <button
            className="bg-white px-2 text-2xl"
            onClick={() => setShowSearch(!showSearch)}
          >
            +
          </button>
          <Search
            hidden={!showSearch}
            excludes={values}
            onSelect={(author) => {
              setShowSearch(false);
              onChange([...values, author]);
            }}
            searchPath={searchPath}
          />
        </li>
      </ul>
    </div>
  );
}

type SearchProps = {
  hidden: boolean;
  onSelect: (value: string) => void;
  excludes: string[];
  searchPath: string;
};

function Search({ hidden, onSelect, excludes, searchPath }: SearchProps) {
  const [search, setSearch] = useState("");
  const [options, setOpions] = useState<string[]>([]);

  useEffect(
    useDebounce(async () => {
      try {
        const result = await axios.get(searchPath, {
          params: { search },
        });

        setOpions(
          result.data.data.filter((value: string) => !excludes.includes(value)),
        );
      } catch (err) {
        console.log(err);
      }
    }, 200),
    [search, hidden],
  );

  if (hidden) return;

  const selectAuthor = options.map((author) => {
    return (
      <li key={author}>
        <button
          className="bg-neutral-300 px-4 py-2"
          onClick={() => onSelect(author)}
        >
          {author}
        </button>
      </li>
    );
  });

  return (
    <div className="absolute top-12.5 left-4 z-10 border border-black bg-neutral-200 px-6 py-4">
      <div>
        Search
        <input
          type="text"
          value={search}
          id="search"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="border border-black"
        />
      </div>
      <ul className="mt-4 flex gap-2">{selectAuthor}</ul>
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
