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
    <div className="min-h-screen flex overflow-x-hidden bg-[#fafaf8] dark:bg-gray-950">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1a1a1a] dark:bg-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-600">
            <span className="text-white font-semibold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">ResumeIQ</span>
        </div>

        <div>
          <p className="text-white text-3xl leading-snug font-light mb-4">
            Every job description has a<br />
            language. Speak it.
          </p>
          <p className="text-sm text-gray-400">
            Upload your resume, paste the role, get a real match score in seconds.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          © 2026 ResumeIQ
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-indigo-600">
              <span className="text-white font-semibold text-xs">R</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">ResumeIQ</span>
          </div>

          <h1 className="text-2xl font-medium mb-1 text-gray-900 dark:text-gray-100">
            Create your account
          </h1>
          <p className="text-sm mb-8 text-gray-500 dark:text-gray-400">
            Start getting AI feedback on your resume
          </p>

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:border-indigo-600 dark:focus:border-indigo-500"
                style={{ fontSize: "16px" }}
                placeholder="Khushi Kushwaha"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:border-indigo-600 dark:focus:border-indigo-500"
                style={{ fontSize: "16px" }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:border-indigo-600 dark:focus:border-indigo-500"
                style={{ fontSize: "16px" }}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900 dark:bg-indigo-600"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm mt-7 text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;