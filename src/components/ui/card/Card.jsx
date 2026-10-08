import React from "react";

/**
 * Modern Flat Card Primitive (Seamless / Border-free)
 * - Zero drop shadow, zero blur, zero border
 * - Rounded-2xl (16px)
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
      className={`bg-surface-main rounded-2xl overflow-hidden border-0 ${
        interactive || onClick
          ? "cursor-pointer hover:bg-surface-subtle/40 active:bg-surface-subtle/70 transition-colors"
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
      className={`px-6 py-4 flex items-center justify-between gap-4 ${className}`}
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
      className={`px-6 py-3.5 bg-surface-subtle/30 flex items-center justify-between gap-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
