import React from "react";
import { Input } from "../../../ui/input";

export default function TextField({ value, onChange, onKeyDown, placeholder }) {
  return (
    <Input
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className='pr-4'
    />
  );
}
