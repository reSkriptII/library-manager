import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, CirclePlus } from "lucide-react";
import type { BookPropEntity } from "@/features/books/type.ts";

type TagsSelectProps = {
  children: React.ReactNode;
  name: string;
  options: { id: number; name: string }[] | null;
  onSelect: (value: { id: number; name: string }) => void;
  onCreate?: (value: string) => void;
};

export function TagsSelect({
  children,
  name,
  options,
  onSelect,
  onCreate,
}: TagsSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-expanded={open} role="combobox" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {` ${name} `} found.</CommandEmpty>
            <CommandItem>
              {onCreate && (
                <CreateField
                  name={name}
                  onCreate={onCreate}
                  setClose={() => setOpen(false)}
                />
              )}
            </CommandItem>
            <CommandGroup>
              {options &&
                options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                  >
                    {option.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type TagListSelectProps = {
  label?: string;
  selectedTags: BookPropEntity[];
  edit: boolean;
  name: string;
  options: BookPropEntity[] | null;
  onSelect: (tag: BookPropEntity) => void;
  onRemove: (tag: BookPropEntity) => void;
  onCreate?: (value: string) => unknown;
};

export function TagListSelect({
  label,
  selectedTags,
  edit,
  name,
  options,
  onSelect,
  onRemove,
  onCreate,
}: TagListSelectProps) {
  return (
    <div className="flex flex-col">
      {label ?? name}
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <Button
            key={tag.id}
            variant="outline"
            onClick={() => {
              if (edit) onRemove(tag);
            }}
          >
            {tag.name}
            {edit && <X />}
          </Button>
        ))}

        {edit && (
          <TagsSelect
            name={name}
            options={options}
            onSelect={(value) => onSelect(value)}
            onCreate={onCreate}
          >
            <Button variant="outline" className="text-xs text-neutral-400">
              <CirclePlus />
              Add {name}
            </Button>
          </TagsSelect>
        )}
      </div>
    </div>
  );
}

type CreateFieldProps = {
  name: string;
  onCreate: (value: string) => unknown;
  setClose: () => void;
};

function CreateField({ name, onCreate, setClose }: CreateFieldProps) {
  const [input, setInput] = useState("");

  function handleCreate() {
    onCreate(input);
    setClose();
  }

  return (
    <details>
      <summary>Create {" " + name}</summary>
      <div className="flex">
        <Label htmlFor="create" className="sr-only">
          create new {" " + name}
        </Label>
        <Input
          id="create"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleCreate}>create</Button>
      </div>
    </details>
  );
}
