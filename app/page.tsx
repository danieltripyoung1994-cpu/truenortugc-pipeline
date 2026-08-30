import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-brand-700/20 border border-brand-700/30 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          AI Video Pipeline
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="text-white">TrueNorth</span>
          <span className="text-brand-500">UGC</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          From brief to finished video in minutes. AI writes the script, an avatar
          delivers it on camera, and you ship it.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
        <Link href="/script-generator" className="group">
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5">
            <div className="w-12 h-12 bg-brand-700/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-700/30 transition-colors">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Video Pipeline</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Enter a brief, get an AI-written script, pick an avatar, and generate a production-ready talking-head video.</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span>\ud83d\udcdd Brief</span><span>\u2192</span><span>\ud83e\udd16 Script</span><span>\u2192</span><span>\ud83e\uddd1 Avatar</span><span>\u2192</span><span>\ud83c\udfac Video</span>
            </div>
          </div>
        </Link>
        <Link href="/sentiment-analyzer" className="group">
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5">
            <div className="w-12 h-12 bg-brand-700/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-700/30 transition-colors">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Sentiment Analyzer</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Paste video comments and get an instant sentiment breakdown with audience insights.</p>
          </div>
        </Link>
      </div>
      <p className="text-gray-600 text-xs mt-16">Built for TrueNorthUGC &middot; GPT-4 + HeyGen</p>
    </div>
  );
}
