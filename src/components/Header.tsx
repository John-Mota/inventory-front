import { useState } from "react";
import { NavLink } from "react-router-dom";
import headerLogo from "../assets/autoflex-header.png";

const navLinks = [
  { to: "/", label: "Painel" },
  { to: "/materials", label: "Matérias-Primas" },
  { to: "/products", label: "Produtos" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-medium ${
      isActive
        ? "text-indigo-400 border-b-2 border-indigo-400 pb-0.5"
        : "text-gray-300 hover:text-indigo-300"
    }`;

  const mobileLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
      <div className="px-[15px]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
            aria-label="Autoflex Home"
          >
            <img src={headerLogo} alt="Autoflex" className="h-9 w-9 rounded-lg object-contain" />
            <span>Autoflex</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 md:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav id="mobile-menu" className="border-t border-gray-700 bg-gray-900 px-4 pb-4 pt-2 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={mobileLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
