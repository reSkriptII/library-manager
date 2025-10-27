import axios from "axios";
import { useState, useEffect } from "react";
import { useDebounce } from "#root/hook/useDebounce.ts";

type SearchProps = {
  hidden: boolean;
  onSelect: (value: string) => void;
  excludes: string[];
  searchPath: string;
  createValuePath: string;
  createValueBody: (value: string) => unknown;
};

export function Search({
  hidden,
  onSelect,
  excludes,
  searchPath,
  createValuePath,
  createValueBody,
}: SearchProps) {
  const [search, setSearch] = useState("");
  const [options, setOpions] = useState<string[]>([]);
  const [newValueInput, setNewValueInput] = useState("");
  const [showNewValueInput, setShowNewValueInput] = useState(false);

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

  async function handleCreate() {
    try {
      await axios.post(createValuePath, createValueBody(newValueInput), {
        withCredentials: true,
      });

      onSelect(newValueInput);
      setShowNewValueInput(false);
    } catch (err) {
      console.log(err);
    }
  }

  if (hidden) return;

  const selectAuthor = options.map((author) => {
    return (
      <li key={author}>
        <button className="bg-white px-4 py-2" onClick={() => onSelect(author)}>
          {author}
        </button>
      </li>
    );
  });

  return (
    <div className="absolute top-12.5 left-4 z-10 max-w-screen border border-black bg-neutral-200 px-6 py-4">
      <div>
        Search
        <input
          type="text"
          value={search}
          id="search"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          className="border border-black bg-white"
        />
      </div>
      <ul className="mt-4 flex flex-wrap items-center gap-2">
        {selectAuthor}
        <li className="relative">
          <button
            className="bg-white px-2 text-2xl"
            onClick={() => setShowNewValueInput(!showNewValueInput)}
          >
            +
          </button>
          <div
            hidden={!showNewValueInput}
            className="absolute top-12 -left-20 z-20 border border-black bg-neutral-200 p-2"
          >
            <label htmlFor="newvalue">new value:</label>
            <div className="flex gap-2">
              <input
                id="newvalue"
                type="text"
                className="w-36 border border-black bg-white px-2"
                value={newValueInput}
                onChange={(e) => setNewValueInput(e.target.value)}
              />
              <button
                onClick={handleCreate}
                className="border border-black bg-white p-1"
              >
                create
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
