import type { InputHTMLAttributes } from "react";

function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 ${className}`}
      {...props}
    />
  );
}

export default TextInput;