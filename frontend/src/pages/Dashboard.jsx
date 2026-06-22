import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" className="rotate-[-90deg]">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f1ef" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold" style={{ color: "#1a1a1a" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "#9ca3af" }}>
          match
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) return setError("Please upload a resume PDF");
    if (!jobDescription || jobDescription.trim().length < 20)
      return setError("Please enter a job description (at least 20 characters)");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const res = await API.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf8" }}>
     <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-medium mb-1" style={{ color: "#1a1a1a" }}>
          Analyze your resume
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          Upload your resume and a job description to see how well they match
        </p>

        <div
          className="rounded-xl p-7 mb-8"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-lg mb-5"
              style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>
                Resume (PDF)
              </label>
              <label
                className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg cursor-pointer text-sm transition"
                style={{
                  border: "1.5px dashed #d1d5db",
                  color: file ? "#1a1a1a" : "#9ca3af",
                  backgroundColor: file ? "#eef2ff" : "transparent",
                }}
              >
                {file ? file.name : "Click to upload your resume"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>
                Job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the job description here..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
                style={{ border: "1px solid #e5e7eb", color: "#1a1a1a" }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              {loading ? "Analyzing..." : "Analyze resume"}
            </button>
          </form>
        </div>

        {result && (
          <div
            className="rounded-xl p-7 space-y-7"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-6">
              <ScoreRing score={result.matchScore} />
              <div>
                <h2 className="text-lg font-medium mb-1" style={{ color: "#1a1a1a" }}>
                  Analysis result
                </h2>
                <p className="text-sm" style={{ color: "#6b7280" }}>{result.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ borderTop: "1px solid #f1f1ef", paddingTop: "1.5rem" }}>
              <div>
                <h3 className="text-xs font-medium mb-2.5" style={{ color: "#374151" }}>
                  Matched keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium mb-2.5" style={{ color: "#374151" }}>
                  Missing keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords?.length > 0 ? (
                    result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm" style={{ color: "#9ca3af" }}>None — great match</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f1f1ef", paddingTop: "1.5rem" }}>
              <h3 className="text-xs font-medium mb-2.5" style={{ color: "#374151" }}>
                Strengths
              </h3>
              <ul className="space-y-1.5">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: "#4b5563" }}>
                    <span style={{ color: "#16a34a" }}>+</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: "1px solid #f1f1ef", paddingTop: "1.5rem" }}>
              <h3 className="text-xs font-medium mb-2.5" style={{ color: "#374151" }}>
                Suggestions
              </h3>
              <ul className="space-y-1.5">
                {result.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: "#4b5563" }}>
                    <span style={{ color: "#4f46e5" }}>→</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;