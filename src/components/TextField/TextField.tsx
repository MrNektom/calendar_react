import React from "react";

interface ITextFieldProps {
  placeholder?: string;
  value?: string;
  onInput?: (value: string) => void;
}

export function TextField({ placeholder, value, onInput }: ITextFieldProps) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onInput={(e) => onInput && onInput(e.currentTarget.value)}
      />
    </div>
  );
}
