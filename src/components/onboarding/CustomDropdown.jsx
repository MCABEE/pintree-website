"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export default function CustomDropdown({
  id,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
  dropdownClassName = "",
  leadingIcon = null,
  showSublabel = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isTechnicalCodeSublabel = (sub) => {
    if (!sub || typeof sub !== "string") return true;
    const s = sub.trim().toLowerCase().replace(/^\(|\)$/g, "").trim();
    if (!s) return true;
    const technicalCodes = [
      "broadcasting",
      "digital",
      "print",
      "wire",
      "radio",
      "magazine",
      "podcast",
      "online_digital_news_publisher",
      "broadcasting_channel",
      "print_publisher",
      "news_agency_wire_service",
      "radio_station",
      "magazine_periodical",
      "podcast_audio_news_network",
      "in",
      "us",
      "gb",
      "ae",
      "sg",
      "ca",
      "au",
    ];
    if (technicalCodes.includes(s)) return true;
    if (/^(country|cnt|state|st|dst|district|ct|city)[-_]/i.test(s)) return true;
    return false;
  };

  // Normalize options to { key, value, label, sublabel, flag, code }
  const normalizedOptions = options.map((opt, idx) => {
    if (typeof opt === "string") {
      return { key: `${opt}-${idx}`, value: opt, label: opt, code: opt, sublabel: "" };
    }
    const val = opt.value !== undefined ? opt.value : opt.id || opt.code;
    const rawSub = showSublabel ? (opt.sublabel || "") : "";
    let cleanLabel = String(opt.label || opt.name || opt.value || "");
    // Strip trailing technical code parentheticals e.g. " (broadcasting)", " (digital)", "(print)"
    cleanLabel = cleanLabel
      .replace(/\s*\((broadcasting|digital|print|wire|radio|magazine|podcast)\)\s*$/i, "")
      .trim();

    const uniqueKey =
      opt.key ||
      (opt.code ? `${opt.code}-${val}` : opt.id ? `${opt.id}-${val}` : `${val}-${cleanLabel}-${idx}`);

    return {
      key: uniqueKey,
      value: val,
      label: cleanLabel,
      sublabel: isTechnicalCodeSublabel(rawSub) ? "" : rawSub,
      flag: opt.flag || null,
      code: opt.code || opt.id || null,
    };
  });

  // Find currently selected option with alias support (e.g. "cnt_in" matches "IN", "country-in", "India")
  const selectedOption = normalizedOptions.find((opt) => {
    const oVal = String(opt.value || "").toLowerCase();
    const curr = String(value || "").toLowerCase();
    if (!curr) return false;
    if (oVal === curr) return true;
    if (String(opt.label || "").toLowerCase() === curr) return true;
    if (opt.code && String(opt.code).toLowerCase() === curr) return true;
    if (opt.sublabel && String(opt.sublabel).toLowerCase() === curr) return true;

    // Normalize prefix variations: "country-in", "cnt_in", "in", "state-dl", "st_dl"
    const stripPrefix = (s) =>
      s.replace(/^(country|cnt|state|st|dst|district|ct|city)[-_]/, "");
    const strippedOVal = stripPrefix(oVal);
    const strippedCurr = stripPrefix(curr);
    if (strippedOVal && strippedCurr && strippedOVal === strippedCurr) return true;

    // Direct enum alias matching for publication types
    const typeAliases = {
      digital: "online_digital_news_publisher",
      online_digital_news_publisher: "digital",
      broadcasting: "broadcasting_channel",
      broadcasting_channel: "broadcasting",
      print: "print_publisher",
      print_publisher: "print",
      wire: "news_agency_wire_service",
      news_agency_wire_service: "wire",
      radio: "radio_station",
      radio_station: "radio",
      magazine: "magazine_periodical",
      magazine_periodical: "magazine",
      podcast: "podcast_audio_news_network",
      podcast_audio_news_network: "podcast",
    };
    if (typeAliases[oVal] === curr || typeAliases[curr] === oVal) return true;

    return false;
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden input for HTML validation if required */}
      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          value={value || ""}
          onChange={() => {}}
          required={required}
          className="sr-only"
          id={`${id}-required-validator`}
        />
      )}

      {/* Main trigger button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full h-[46px] px-4 flex items-center justify-between text-left rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md transition-all cursor-pointer border border-transparent ${
          isOpen
            ? "bg-surface-container-lowest ring-2 ring-secondary border-transparent"
            : "hover:bg-surface-container focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {leadingIcon && (
            <Icon
              name={leadingIcon}
              className="text-on-surface-variant text-[18px] shrink-0"
            />
          )}
          {selectedOption ? (
            <span className="truncate text-on-surface font-medium flex items-center gap-2">
              {selectedOption.flag && <span>{selectedOption.flag}</span>}
              <span>{selectedOption.label}</span>
              {selectedOption.sublabel && selectedOption.sublabel !== selectedOption.label && (
                <span className="text-on-surface-variant text-xs font-normal">
                  ({selectedOption.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="truncate text-on-surface-variant/60 font-normal">
              {placeholder}
            </span>
          )}
        </div>
        <Icon
          name={isOpen ? "expand_less" : "expand_more"}
          className="text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200"
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 mt-1.5 w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg py-1 text-on-surface animate-fadeIn overflow-hidden ${
            dropdownClassName || ""
          }`}
          style={{ minWidth: "100%" }}
        >
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {normalizedOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-on-surface-variant text-center">
                No options available
              </div>
            ) : (
              normalizedOptions.map((opt, idx) => {
                const isSelected = selectedOption && selectedOption.value === opt.value;
                return (
                  <button
                    key={opt.key || `${String(opt.value)}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-4 py-2.5 font-body-md text-body-md hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-surface-container font-semibold text-secondary"
                        : "text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.flag && <span>{opt.flag}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && opt.sublabel !== opt.label && (
                        <span className="text-on-surface-variant text-xs font-normal shrink-0">
                          ({opt.sublabel})
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Icon
                        name="check"
                        className="text-[16px] text-secondary shrink-0"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { CustomDropdown };
