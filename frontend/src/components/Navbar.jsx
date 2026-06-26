import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `text-sm transition ${
      location.pathname === path
        ? "text-gray-900 dark:text-gray-100 font-medium"
        : "text-gray-400 dark:text-gray-500"
    }`;

  return (
    <header className="px-4 sm:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-indigo-600">
            <span className="text-white font-semibold text-xs">R</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">ResumeIQ</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 ml-8 flex-1">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Analyze
          </Link>
          <Link to="/history" className={linkClass("/history")}>
            History
          </Link>
        </nav>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-4">
          <button onClick={toggleTheme} className="text-lg leading-none" aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
          </button>
          <span className="text-sm truncate max-w-[140px] text-gray-500 dark:text-gray-400">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm px-3.5 py-1.5 rounded-lg transition border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            Log out
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-2xl leading-none text-gray-900 dark:text-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link to="/dashboard" className={linkClass("/dashboard")} onClick={() => setMenuOpen(false)}>
            Analyze
          </Link>
          <Link to="/history" className={linkClass("/history")} onClick={() => setMenuOpen(false)}>
            History
          </Link>
          <button onClick={toggleTheme} className="text-sm text-left text-gray-500 dark:text-gray-400">
            {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm px-3.5 py-1.5 rounded-lg transition border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;