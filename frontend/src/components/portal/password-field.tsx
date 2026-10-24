"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  name?: string;
};

/** Password input with an accessible show/hide toggle. */
export default function PasswordField({
  label,
  value,
  onChange,
  placeholder = "Enter password",
  autoComplete = "current-password",
  required = false,
  error,
  name = "password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="label-gov">
        {label}
        {required && <span className="ml-1 text-[var(--gov-danger)]">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`input-gov pr-11 ${error ? "input-error" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r text-[var(--gov-muted)] transition-colors hover:text-[var(--gov-heading)]"
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-[11.5px] font-semibold text-[var(--gov-danger)]">
          <Icon name="alertTriangle" size={13} />
          {error}
        </p>
      )}
    </div>
  );
}
