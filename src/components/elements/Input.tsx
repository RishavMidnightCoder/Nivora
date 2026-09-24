import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-navy-900">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;