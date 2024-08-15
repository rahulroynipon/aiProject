import React from "react";
import { cn } from "../../lib/cn";

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  isError,
  placeholder,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold" htmlFor={id}>
        {label} {required && label && <span className="text-red-500">*</span>}
      </label>
      <input
        className={cn("input ring-1 ring-black/25", { "bg-red-200": isError })}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
