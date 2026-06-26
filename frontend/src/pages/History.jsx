import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/resume/history");
        setHistory(res.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const scoreClass = (score) =>
    score >= 75
      ? "text-green-600 dark:text-green-400"
      : score >= 50
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-gray-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-medium mb-1 text-gray-900 dark:text-gray-100">
          Analysis history
        </h1>
        <p className="text-sm mb-8 text-gray-500 dark:text-gray-400">
          All your past resume analyses
        </p>

        {loading && (
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        )}

        {error && (
          <div className="text-sm px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="rounded-xl p-10 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No analyses yet. Go to "Analyze" to check your first resume.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item._id}
              className="rounded-xl p-5 cursor-pointer transition bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                    {item.fileName}
                  </p>
                  <p className="text-xs mt-0.5 text-gray-400 dark:text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className={`text-lg font-semibold flex-shrink-0 ${scoreClass(item.matchScore)}`}>
                  {item.matchScore}%
                </div>
              </div>

              {expandedId === item._id && (
                <div className="mt-4 pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.summary}</p>

                  <div>
                    <h4 className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Matched keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matchedKeywords?.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.missingKeywords?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Missing keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;