import type { booksSearchOption, booksSearchField } from "./type";

type args = {
  searchOption: booksSearchOption;
  onChange: (
    option: "data" | "searchField" | "availableOnly",
    value: string,
  ) => void;
};

export function SearchField({ searchOption, onChange }: args) {
  return (
    <div>
      <SearchTextInput searchOption={searchOption} onChange={onChange} />
      <SearchFieldSelect searchOption={searchOption} onChange={onChange} />
      <AvailableOnlyCheckbox searchOption={searchOption} onChange={onChange} />
    </div>
  );
}

function SearchTextInput({ searchOption, onChange }: args) {
  return (
    <label className="relative flex w-fit items-center gap-2 rounded-md border-2 border-yellow-400 bg-amber-100 px-2">
      Search
      <input
        type="text"
        value={searchOption.data}
        id="search"
        name="search"
        onChange={(e) => onChange("data", e.target.value)}
        className="w-120 border-l-8 border-yellow-400 bg-amber-50 px-2 py-1"
      />
      <img src="./search.svg" className="size-8" alt="search" />
    </label>
  );
}

function SearchFieldSelect({ searchOption, onChange }: args) {
  return (
    <div>
      Search on:
      {["title", "author", "genre"].map((field, index) => {
        return (
          <label key={index}>
            {field}
            <input
              type="radio"
              name="searchon"
              id="searchon"
              checked={searchOption.searchField === field}
              onChange={() => onChange("searchField", field)}
              className=""
            />
          </label>
        );
      })}
    </div>
  );
}

function AvailableOnlyCheckbox({ searchOption, onChange }: args) {
  return (
    <label>
      Only show avaialble book
      <input
        type="checkbox"
        name="availablenoly"
        id="avaialbleonly"
        checked={searchOption.availableOnly}
        onChange={(e) => onChange("availableOnly", e.target.value)}
      />
    </label>
  );
}
