import React from "react";
import { Input } from "../../../ui/input";

export default function DateField({ value, onChange, selectedFilterId }) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const commonProps = {
    type: "date",
    value: value,
    onChange: (e) => onChange(e.target.value),
    className: "pr-4",
  };

  if (selectedFilterId === "invoiceDate") {
    return <Input {...commonProps} max={todayStr} />;
  }

  if (selectedFilterId === "dueDate") {
    return <Input {...commonProps} min={todayStr} />;
  }

  return <Input {...commonProps} />;
}
