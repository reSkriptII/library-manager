import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type Filter = { id: string; name: string };
type SearchUserProps = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export function SearchUser({ filter, setFilter }: SearchUserProps) {
  return (
    <div className="mb-4 flex w-full gap-2">
      <div className="w-42">
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          type="number"
          value={filter.id}
          onChange={(e) => setFilter({ id: e.target.value, name: filter.name })}
        />
      </div>
      <div className="grow">
        <Label htmlFor="username">name</Label>
        <Input
          id="username"
          type="text"
          disabled={Boolean(filter.id)}
          value={filter.name}
          onChange={(e) => setFilter({ id: filter.id, name: e.target.value })}
        />
      </div>
    </div>
  );
}
