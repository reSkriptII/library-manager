import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type FormInputProps = {
  label: string;
  type: HTMLInputTypeAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: any;
  required?: boolean;
  invalidMsg?: string;
};

export function FormInput({
  label,
  type,
  onChange,
  value,
  required,
  invalidMsg,
}: FormInputProps) {
  return (
    <label className="my-4 block">
      {label}
      <input
        type={type}
        className="peer block w-full rounded-lg border border-neutral-600 bg-white p-1 user-invalid:border-red-500"
        onChange={onChange}
        value={value}
        required={required}
      />
      <p className="hidden peer-user-invalid:block">{invalidMsg}</p>
    </label>
  );
}
