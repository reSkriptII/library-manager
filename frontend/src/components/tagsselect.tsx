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
};

export function TagsSelect({
  children,
  name,
  options,
  onSelect,
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
};

export function TagListSelect({
  label,
  selectedTags,
  edit,
  name,
  options,
  onSelect,
  onRemove,
}: TagListSelectProps) {
  return (
    <div className="flex flex-col">
      {label ?? name}
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <Button
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
