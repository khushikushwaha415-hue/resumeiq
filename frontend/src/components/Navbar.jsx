import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#1a1a1a" : "#9ca3af",
    fontWeight: location.pathname === path ? 500 : 400,
  });

  return (
    <header
      className="px-4 sm:px-8 py-4"
      style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#4f46e5" }}>
            <span className="text-white font-semibold text-xs">R</span>
          </div>
          <span className="font-semibold" style={{ color: "#1a1a1a" }}>ResumeIQ</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 ml-8 flex-1">
          <Link to="/dashboard" className="text-sm transition" style={linkStyle("/dashboard")}>
            Analyze
          </Link>
          <Link to="/history" className="text-sm transition" style={linkStyle("/history")}>
            History
          </Link>
        </nav>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm truncate max-w-[140px]" style={{ color: "#6b7280" }}>{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm px-3.5 py-1.5 rounded-lg transition"
            style={{ border: "1px solid #e5e7eb", color: "#374151" }}
          >
            Log out
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-2xl leading-none"
          style={{ color: "#1a1a1a" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-4 pt-4" style={{ borderTop: "1px solid #f1f1ef" }}>
          <Link to="/dashboard" className="text-sm" style={linkStyle("/dashboard")} onClick={() => setMenuOpen(false)}>
            Analyze
          </Link>
          <Link to="/history" className="text-sm" style={linkStyle("/history")} onClick={() => setMenuOpen(false)}>
            History
          </Link>
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #f1f1ef" }}>
            <span className="text-sm" style={{ color: "#6b7280" }}>{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm px-3.5 py-1.5 rounded-lg transition"
              style={{ border: "1px solid #e5e7eb", color: "#374151" }}
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