import { useState } from "react";
import { Search } from "./Search";

type SelectSearchProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  searchPath: string;
  createValuePath: string;
  createValueBody: (value: string) => unknown;
};

export function SelectSearch({
  label,
  values,
  onChange,
  searchPath,
  createValuePath,
  createValueBody,
}: SelectSearchProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="my-4">
      <p>{label}</p>
      <ul className="relative flex items-center gap-2 bg-neutral-200 px-4 py-2">
        {values.map((currentValue) => {
          return (
            <li className="flex items-center bg-white pl-4" key={currentValue}>
              {currentValue}
              <button
                className="p-2 px-4 text-red-400"
                onClick={() =>
                  onChange(values.filter((value) => value != currentValue))
                }
              >
                x
              </button>
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
            createValuePath={createValuePath}
            createValueBody={createValueBody}
          />
        </li>
      </ul>
    </div>
  );
}
