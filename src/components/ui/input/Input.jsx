import React, { forwardRef } from "react";

/**
 * Modern Flat Input & Textarea Primitives
 * - Zero drop shadow, zero blur
 * - Rounded-xl (12px)
 * - 1px crisp border
 * - Focus ring Tangerine
 */
export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-text-main select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none">
              <LeftIcon className="size-4 shrink-0" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full h-10 bg-surface-main text-text-main text-sm rounded-xl border transition-colors placeholder:text-text-muted disabled:bg-surface-subtle disabled:cursor-not-allowed disabled:text-text-muted ${
              error
                ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger"
                : "border-border-main focus:border-primary focus:ring-1 focus:ring-primary"
            } ${LeftIcon ? "pl-10" : "pl-3.5"} ${
              RightIcon || props.rightElement ? "pr-10" : "pr-3.5"
            } outline-none ${className}`}
            {...props}
          />
          {props.rightElement ? (
            <div className="absolute right-2.5 text-text-muted flex items-center">
              {props.rightElement}
            </div>
          ) : RightIcon ? (
            <div className="absolute right-3.5 text-text-muted pointer-events-none">
              <RightIcon className="size-4 shrink-0" />
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs text-danger font-medium leading-none">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted leading-none">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef(
  ({ label, error, helperText, className = "", id, disabled, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold text-text-main select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={`w-full bg-surface-main text-text-main text-sm rounded-xl p-3.5 border transition-colors placeholder:text-text-muted disabled:bg-surface-subtle disabled:cursor-not-allowed disabled:text-text-muted resize-none ${
            error
              ? "border-danger focus:border-danger focus:ring-1 focus:ring-danger"
              : "border-border-main focus:border-primary focus:ring-1 focus:ring-primary"
          } outline-none ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-danger font-medium leading-none">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted leading-none">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Input;
