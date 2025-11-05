import React from "react";
import { Input } from "../../../ui/input";

export default function NumberField({
  value,
  onChange,
  onKeyDown,
  placeholder,
}) {
  const handleChange = (e) => {
    const v = e.target.value;
    if (v === "") return onChange("");
    const n = Number(v);
    if (Number.isNaN(n)) return onChange("");
    if (n < 0) return onChange("0");
    // keep as string to preserve user input format
    onChange(v);
  };

  return (
    <Input
      type='number'
      min={0}
      step='any'
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      className='pr-4'
    />
  );
}
