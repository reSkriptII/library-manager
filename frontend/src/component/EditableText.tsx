import { useState } from "react";

type EditableTextProps = {
  value: string;
  onSave: (value: string) => Promise<void>;
};

export function EditableText({ value, onSave }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(value);

  async function handleSave() {
    setIsEditing(false);
    if (input === value) return;

    try {
      await onSave(input);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {isEditing ? (
        <>
          <input
            className="border border-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />{" "}
          <button className="bg-green-200" onClick={handleSave}>
            save
          </button>
          <button className="bg-red-200" onClick={() => setIsEditing(false)}>
            cancel
          </button>
        </>
      ) : (
        <p onClick={() => setIsEditing(true)}>{value}</p>
      )}
    </div>
  );
}
