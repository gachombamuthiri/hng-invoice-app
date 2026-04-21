import React from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={inputId}
        className={`input-field ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="error-text">
          {error.message}
        </p>
      )}
    </div>
  );
};
