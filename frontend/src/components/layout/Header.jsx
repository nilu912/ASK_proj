import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "mr" : "en";
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t("navigation.home"), path: "/" },
    { name: t("navigation.gallery"), path: "/gallery" },
    { name: t("navigation.events"), path: "/events" },
    { name: t("navigation.donation"), path: "/donate" },
    { name: t("navigation.inquiry"), path: "/inquiry" },
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            Apang Seva Kendra
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium ${
                  location.pathname === link.path
                    ? "text-yellow-500"
                    : "text-gray-800 hover:text-yellow-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Language Toggle + Admin */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              {i18n.language === "en" ? "मराठी" : "English"}
            </button>
            <Link
              to="/admin/login"
              className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700"
            >
              {t("navigation.admin")}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium ${
                    location.pathname === link.path
                      ? "text-yellow-500"
                      : "text-gray-800 hover:text-yellow-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t pt-4 mt-4">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                {i18n.language === "en" ? "मराठी" : "English"}
              </button>
              <Link
                to="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700"
              >
                {t("navigation.admin")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
