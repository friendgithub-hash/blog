import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { languages, getLanguageByCode } from "../config/languages";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const currentLanguage = getLanguageByCode(i18n.language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev < languages.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : languages.length - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0) {
          handleLanguageChange(languages[focusedIndex].code);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  };

  const handleLanguageChange = async (languageCode) => {
    if (languageCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // Change language using i18n
      await i18n.changeLanguage(languageCode);

      // Get language configuration
      const selectedLanguage = getLanguageByCode(languageCode);

      // Update HTML lang attribute
      document.documentElement.lang = languageCode;

      // Update HTML dir attribute based on language direction
      document.documentElement.dir = selectedLanguage.dir;

      // Store language preference to localStorage (i18next handles this automatically via LanguageDetector)
      localStorage.setItem("i18nextLng", languageCode);
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={isLoading}
      >
        <span className="text-xl" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.nativeName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((language, index) => {
            const isActive = language.code === i18n.language;
            const isFocused = index === focusedIndex;

            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
                } ${
                  isFocused ? "bg-gray-100 dark:bg-gray-800" : ""
                } focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800`}
                disabled={isLoading}
                role="menuitem"
                tabIndex={isFocused ? 0 : -1}
              >
                <span className="text-2xl" aria-hidden="true">
                  {language.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {language.name}
                  </div>
                </div>
                {isActive && (
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Loading...
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
