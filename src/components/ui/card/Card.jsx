import React from "react";

/**
 * Modern Flat Card Primitive
 * - Zero drop shadow, zero blur
 * - Rounded-2xl (16px)
 * - 1px crisp border
 * - Compound components: Card, Card.Header, Card.Body, Card.Footer
 */
export function Card({
  children,
  className = "",
  interactive = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-main border border-border-main rounded-2xl overflow-hidden ${
        interactive || onClick
          ? "cursor-pointer hover:border-border-strong active:bg-surface-subtle/50 transition-colors"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <div
      className={`px-6 py-4 border-b border-border-main flex items-center justify-between gap-4 ${className}`}
    >
      <div>
        {title && (
          <h3 className="text-base font-bold text-text-main leading-snug">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-3.5 border-t border-border-main bg-surface-subtle/30 flex items-center justify-between gap-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
