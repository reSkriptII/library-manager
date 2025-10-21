import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type FormInputProps = {
  label: string;
  type: HTMLInputTypeAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: any;
  required?: boolean;
  invalidMsg?: string;
  min?: number;
  max?: number;
  minLength?: number;
};

export function FormInput({
  label,
  type,
  onChange,
  value,
  required,
  invalidMsg,
  min,
  max,
  minLength,
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
        min={min}
        max={max}
        minLength={minLength}
      />
      <p className="hidden peer-user-invalid:block">{invalidMsg}</p>
    </label>
  );
}
