"use client";

import { useState } from "react";

export default function SentimentAnalyzer() {
  const [comments, setComments] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!comments.trim() || loading) return;
    setError("");
    setAnalysis("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: comments.trim() }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setAnalysis(data.analysis); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Comment Sentiment Analyzer</h1>
        <p className="text-gray-400 text-sm">Paste video comments below and get an AI-powered sentiment breakdown with actionable insights.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Video Comments</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Paste comments here, one per line." rows={14} className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors resize-none leading-relaxed" />
          <button onClick={analyze} disabled={!comments.trim() || loading} className="mt-4 w-full bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-3 transition-colors flex items-center justify-center gap-2 text-sm">
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </button>
        </div>
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Analysis Results</h3>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          {!analysis && !error && !loading && <div className="flex flex-col items-center justify-center h-[300px] text-center"><p className="text-gray-500 text-sm">Paste comments and hit analyze to see results here.</p></div>}
          {loading && <div className="flex items-center justify-center h-[300px]"><svg className="animate-spin w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>}
          {analysis && <div className="prose prose-invert prose-sm max-w-none overflow-y-auto max-h-[500px] pr-1"><div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">{analysis}</div></div>}
        </div>
      </div>
    </div>
  );
}
