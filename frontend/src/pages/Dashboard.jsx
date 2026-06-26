import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" className="rotate-[-90deg]">
        <circle cx="64" cy="64" r={radius} fill="none" className="stroke-gray-100 dark:stroke-gray-700" strokeWidth="10" />
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
        <span className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {score}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          match
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
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
    <div className="min-h-screen bg-[#fafaf8] dark:bg-gray-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-medium mb-1 text-gray-900 dark:text-gray-100">
          Analyze your resume
        </h1>
        <p className="text-sm mb-8 text-gray-500 dark:text-gray-400">
          Upload your resume and a job description to see how well they match
        </p>

        <div className="rounded-xl p-7 mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          {error && (
            <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Resume (PDF)
              </label>
              <label
                className={`flex items-center justify-center gap-2 px-4 py-6 rounded-lg cursor-pointer text-sm transition border-[1.5px] border-dashed ${
                  file
                    ? "border-gray-300 dark:border-gray-600 bg-indigo-50 dark:bg-indigo-950 text-gray-900 dark:text-gray-100"
                    : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                }`}
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
              <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste the job description here..."
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:border-indigo-600 dark:focus:border-indigo-500"
                style={{ fontSize: "16px" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900 dark:bg-indigo-600"
            >
              {loading ? "Analyzing..." : "Analyze resume"}
            </button>
          </form>
        </div>

        {result && (
          <div className="rounded-xl p-7 space-y-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              <ScoreRing score={result.matchScore} />
              <div>
                <h2 className="text-lg font-medium mb-1 text-gray-900 dark:text-gray-100">
                  Analysis result
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{result.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <h3 className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300">
                  Matched keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300">
                  Missing keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords?.length > 0 ? (
                    result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">None — great match</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300">
                Strengths
              </h3>
              <ul className="space-y-1.5">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400">+</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="text-xs font-medium mb-2.5 text-gray-700 dark:text-gray-300">
                Suggestions
              </h3>
              <ul className="space-y-1.5">
                {result.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-indigo-600 dark:text-indigo-400">→</span>{s}
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