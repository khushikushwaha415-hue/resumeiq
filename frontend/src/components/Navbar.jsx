import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#1a1a1a" : "#9ca3af",
    fontWeight: location.pathname === path ? 500 : 400,
  });

  return (
    <header
      className="px-8 py-4 flex justify-between items-center"
      style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
    >
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#4f46e5" }}>
            <span className="text-white font-semibold text-xs">R</span>
          </div>
          <span className="font-semibold" style={{ color: "#1a1a1a" }}>ResumeIQ</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm transition" style={linkStyle("/dashboard")}>
            Analyze
          </Link>
          <Link to="/history" className="text-sm transition" style={linkStyle("/history")}>
            History
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "#6b7280" }}>{user?.name}</span>
        <button
          onClick={logout}
          className="text-sm px-3.5 py-1.5 rounded-lg transition"
          style={{ border: "1px solid #e5e7eb", color: "#374151" }}
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;