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

  const scoreColor = (score) =>
    score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf8" }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-medium mb-1" style={{ color: "#1a1a1a" }}>
          Analysis history
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          All your past resume analyses
        </p>

        {loading && (
          <p className="text-sm" style={{ color: "#9ca3af" }}>Loading...</p>
        )}

        {error && (
          <div className="text-sm px-4 py-3 rounded-lg" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div
            className="rounded-xl p-10 text-center"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              No analyses yet. Go to "Analyze" to check your first resume.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item._id}
              className="rounded-xl p-5 cursor-pointer transition"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
              onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                    {item.fileName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className="text-lg font-semibold"
                  style={{ color: scoreColor(item.matchScore) }}
                >
                  {item.matchScore}%
                </div>
              </div>

              {expandedId === item._id && (
                <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid #f1f1ef" }}>
                  <p className="text-sm" style={{ color: "#6b7280" }}>{item.summary}</p>

                  <div>
                    <h4 className="text-xs font-medium mb-2" style={{ color: "#374151" }}>
                      Matched keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matchedKeywords?.map((kw, i) => (
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

                  {item.missingKeywords?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-2" style={{ color: "#374151" }}>
                        Missing keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-md"
                            style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
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