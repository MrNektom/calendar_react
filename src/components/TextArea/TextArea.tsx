import React from "react";

interface ITextAreaProps {
  placeholder?: string;
  value?: string;
  onInput?: (value: string) => void;
}

export function TextArea({ placeholder, value, onInput }: ITextAreaProps) {
  return (
    <div>
      <textarea
        placeholder={placeholder}
        value={value}
        onInput={(e) => onInput && onInput(e.currentTarget.value)}
      />
    </div>
  );
}
