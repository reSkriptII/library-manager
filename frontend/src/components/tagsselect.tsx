"use client";

import * as React from "react";
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
  const [open, setOpen] = React.useState(false);

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
