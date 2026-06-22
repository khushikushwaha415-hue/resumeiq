import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", { name, email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fafaf8" }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: "#4f46e5" }}>
            <span className="text-white font-semibold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">ResumeIQ</span>
        </div>

        <div>
          <p className="text-white text-3xl leading-snug font-light mb-4">
            Every job description has a<br />
            language. Speak it.
          </p>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Upload your resume, paste the role, get a real match score in seconds.
          </p>
        </div>

        <p className="text-xs" style={{ color: "#6b7280" }}>
          © 2026 ResumeIQ
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#4f46e5" }}>
              <span className="text-white font-semibold text-xs">R</span>
            </div>
            <span className="font-semibold" style={{ color: "#1a1a1a" }}>ResumeIQ</span>
          </div>

          <h1 className="text-2xl font-medium mb-1" style={{ color: "#1a1a1a" }}>
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Start getting AI feedback on your resume
          </p>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-lg mb-5"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
                style={{ border: "1px solid #e5e7eb", color: "#1a1a1a" }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
                style={{ border: "1px solid #e5e7eb", color: "#1a1a1a" }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
                style={{ border: "1px solid #e5e7eb", color: "#1a1a1a" }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm mt-7 text-center" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium" style={{ color: "#4f46e5" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;