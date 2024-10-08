import React from "react";
<<<<<<< HEAD
import cn from "../../lib/cn";
=======
import { cn } from "../../lib/cn";
>>>>>>> 7a6c11d8aa51212c43914995b5451fcdc55dc0d4

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
        className={cn("input ring-1 ring-black/25", {
          "bg-red-200": isError,
          "opacity-50 cursor-not-allowed": type == "submit" && disabled,
          "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed":
            disabled,
        })}
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
