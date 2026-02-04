import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * AdBanner Component
 *
 * @param {string} backgroundImage - URL of the background image
 * @param {string} title - Main title text
 * @param {string} highlight - Highlighted part of the title (optional)
 * @param {string} subtitle - Subtitle or description text
 * @param {string} badge - Top right badge text (e.g., "Sponsored")
 * @param {string} promoBadge - Inline promo badge text (e.g., "Promo")
 * @param {string} href - External link to open (optional)
 * @param {function} onClick - Click handler (optional, used if href is not provided)
 * @param {string} highlightColor - Tailwind class for highlight color (default: text-orange-500)
 * @param {string} promoColor - Tailwind class for promo badge background (default: bg-orange-500)
 */
const AdBanner = ({
  backgroundImage,
  title,
  highlight,
  subtitle,
  badge = "Được tài trợ",
  promoBadge,
  href,
  onClick,
  highlightColor = "text-orange-500",
  promoColor = "bg-orange-500",
}) => {
  const content = (
    <>
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end items-start text-white">
        {badge && (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
              {badge}
            </span>
          </div>
        )}

        <div className="mb-1">
          {promoBadge && (
            <span
              className={`text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block shadow-sm ${promoColor}`}
            >
              {promoBadge}
            </span>
          )}
          <h4 className="text-2xl font-black leading-none uppercase italic tracking-tighter">
            {title}{" "}
            {highlight && <span className={highlightColor}>{highlight}</span>}
          </h4>
        </div>

        <div className="flex items-center justify-between w-full mt-2">
          <p
            className="text-sm font-medium text-gray-300"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
          <div
            className={`bg-white/20 p-1.5 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-300`}
          >
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </>
  );

  const containerClasses =
    "w-full relative h-40 overflow-hidden group rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 block text-left mb-0";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={containerClasses}>
      {content}
    </button>
  );
};

export default AdBanner;
