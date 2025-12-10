import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/CECC.png";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Products", href: "#products" },
];

export const Navbar = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBgClass =
    isScrolled || isMobileMenuOpen
      ? "bg-gradient-to-r from-deep-red to-dark-red shadow-xl py-2 px-6 rounded-full mt-4 mx-4 w-[calc(100%-2rem)] max-w-screen-xl md:mx-auto border border-white/10 backdrop-blur-md"
      : "bg-transparent py-6 w-full px-4";

  const containerClass = isScrolled
    ? "flex items-center justify-between w-full"
    : "max-w-screen-xl mx-auto flex items-center justify-between w-full";

  const textClass = "text-red-100 hover:text-white";
  const logoTextClass = "text-white whitespace-nowrap";
  const logoBgClass = "bg-white text-deep-red shadow-md shrink-0";
  const buttonClass =
    "bg-white text-deep-red hover:bg-red-50 shadow-lg shrink-0 whitespace-nowrap";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? "pt-0" : ""
      }`}
    >
      <div className={navBgClass}>
        <div className={containerClass}>
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${logoBgClass}`}
            >
              <img src={logo} alt="" />
            </div>
            <span
              className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${logoTextClass}`}
            >
              Candelaria <span className="hidden sm:inline">Eye Care</span>
              <span className="text-red-200"> Clinic</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${textClass}`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => navigate("/login")}
              className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5 ${buttonClass}`}
            >
              Log in
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white hover:text-red-100 transition-colors shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-dark-red to-deep-red shadow-xl border border-white/10 md:hidden flex flex-col p-4 animate-fadeIn rounded-2xl mx-0">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-red-100 font-medium border-b border-red-800/50 hover:text-white hover:bg-white/5 px-4 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 w-full text-center px-5 py-3 bg-white text-deep-red font-bold rounded-xl hover:bg-red-50 shadow-md"
            >
              Book Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};
