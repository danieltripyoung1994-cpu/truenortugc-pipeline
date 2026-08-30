"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string | null;
  gender: string;
}

type Step = "brief" | "script" | "avatar" | "generating" | "done";

export default function PipelinePage() {
  const [step, setStep] = useState<Step>("brief");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("casual & authentic");
  const [keyMessage, setKeyMessage] = useState("");
  const [script, setScript] = useState("");
  const [scriptLoading, setScriptLoading] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarsLoading, setAvatarsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [avatarSearch, setAvatarSearch] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoStatus, setVideoStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateScript = async () => {
    setError("");
    setScriptLoading(true);
    try {
      const prompt = `Create a UGC video script for the following brief:\n\n**Product/Brand:** ${product}\n**Target Audience:** ${audience}\n**Tone:** ${tone}\n**Key Message:** ${keyMessage}\n\nWrite the script as spoken dialogue only (what the person on camera will say), optimized for a short-form talking-head video (30-60 seconds). Include a strong hook in the first line. Do NOT include stage directions, camera notes, or section labels — just the spoken words, paragraph by paragraph.`;
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setScript(data.reply); setStep("script"); }
    } catch { setError("Network error generating script."); }
    finally { setScriptLoading(false); }
  };

  const proceedToAvatars = async () => {
    setError(""); setStep("avatar"); setAvatarsLoading(true);
    try {
      const res = await fetch("/api/heygen/avatars");
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else {
        setAvatars(data.avatars || []);
        if (data.avatars?.length > 0 && !selectedAvatar) setSelectedAvatar(data.avatars[0].avatar_id);
      }
    } catch { setError("Failed to load avatars."); }
    finally { setAvatarsLoading(false); }
  };

  const generateVideo = async () => {
    setError(""); setStep("generating");
    try {
      const res = await fetch("/api/heygen/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, avatar_id: selectedAvatar }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setStep("avatar"); return; }
      setVideoId(data.video_id); setVideoStatus("processing"); startPolling(data.video_id);
    } catch { setError("Failed to start video generation."); setStep("avatar"); }
  };

  const startPolling = useCallback((id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/heygen/video-status?video_id=${id}`);
        const data = await res.json();
        if (data.status === "completed") {
          setVideoStatus("completed"); setVideoUrl(data.video_url || "");
          setThumbnailUrl(data.thumbnail_url || ""); setVideoDuration(data.duration || null);
          setStep("done"); if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.status === "failed") {
          setVideoStatus("failed"); setError(data.error || "Video generation failed.");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch { /* retry */ }
    }, 5000);
  }, []);

  useEffect(() => { return () => { if (pollRef.current) clearInterval(pollRef.current); }; }, []);

  const resetPipeline = () => {
    setStep("brief"); setProduct(""); setAudience(""); setTone("casual & authentic");
    setKeyMessage(""); setScript(""); setSelectedAvatar(""); setVideoId("");
    setVideoStatus(""); setVideoUrl(""); setThumbnailUrl(""); setVideoDuration(null);
    setError(""); if (pollRef.current) clearInterval(pollRef.current);
  };

  const filteredAvatars = avatars.filter(
    (a) => a.avatar_name.toLowerCase().includes(avatarSearch.toLowerCase()) || a.avatar_id.toLowerCase().includes(avatarSearch.toLowerCase())
  );

  const steps: { key: Step; label: string; num: number }[] = [
    { key: "brief", label: "Brief", num: 1 },
    { key: "script", label: "Script", num: 2 },
    { key: "avatar", label: "Avatar", num: 3 },
    { key: "generating", label: "Generate", num: 4 },
    { key: "done", label: "Done", num: 5 },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= stepIndex ? "bg-brand-600 text-white" : "bg-dark-800 border border-white/10 text-gray-500"}`}>
              {i < stepIndex ? "\u2713" : s.num}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= stepIndex ? "text-brand-400" : "text-gray-500"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < stepIndex ? "bg-brand-600" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm">{error}</div>}

      {step === "brief" && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-1">Create Your Video Brief</h2>
          <p className="text-gray-400 text-sm mb-8">Tell us about your product and audience. AI will generate a script, then an avatar will bring it to life on video.</p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Product / Brand *</label>
              <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder='e.g. "GlowSerum — a Vitamin C face serum"' className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Audience *</label>
              <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder='e.g. "Gen Z women 18-25 into skincare"' className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Tone / Vibe</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 transition-colors">
                <option value="casual & authentic">Casual & Authentic</option>
                <option value="energetic & hype">Energetic & Hype</option>
                <option value="calm & trustworthy">Calm & Trustworthy</option>
                <option value="funny & relatable">Funny & Relatable</option>
                <option value="professional & polished">Professional & Polished</option>
                <option value="emotional & storytelling">Emotional & Storytelling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Message *</label>
              <textarea value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} placeholder='e.g. "This serum cleared my skin in 2 weeks"' rows={3} className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors resize-none" />
            </div>
          </div>
          <button onClick={generateScript} disabled={!product.trim() || !audience.trim() || !keyMessage.trim() || scriptLoading} className="mt-8 w-full bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-3.5 transition-colors flex items-center justify-center gap-2">
            {scriptLoading ? (<><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating Script...</>) : (<>Generate Script with AI \u2192</>)}
          </button>
        </div>
      )}

      {step === "script" && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-1">Review Your Script</h2>
          <p className="text-gray-400 text-sm mb-6">Edit the script below if needed. This is exactly what the AI avatar will say on camera.</p>
          <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={12} className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 outline-none focus:border-brand-500/50 transition-colors resize-y leading-relaxed font-mono" />
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep("brief")} className="px-6 py-3 bg-dark-900 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">\u2190 Back to Brief</button>
            <button onClick={proceedToAvatars} disabled={!script.trim()} className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-3 transition-colors text-sm">Choose Avatar \u2192</button>
          </div>
        </div>
      )}

      {step === "avatar" && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-1">Choose Your Avatar</h2>
          <p className="text-gray-400 text-sm mb-6">Pick an AI avatar to deliver your script on camera.</p>
          {avatarsLoading ? (
            <div className="flex items-center justify-center py-16"><svg className="animate-spin w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><span className="ml-3 text-gray-400">Loading avatars from HeyGen...</span></div>
          ) : avatars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No avatars loaded. HeyGen API key may not be set.</p>
              <button onClick={generateVideo} className="bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl px-6 py-3 transition-colors text-sm">Generate with Default Avatar \u2192</button>
            </div>
          ) : (
            <>
              <input type="text" value={avatarSearch} onChange={(e) => setAvatarSearch(e.target.value)} placeholder="Search avatars..." className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-500/50 transition-colors mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredAvatars.map((avatar) => (
                  <button key={avatar.avatar_id} onClick={() => setSelectedAvatar(avatar.avatar_id)} className={`relative rounded-xl border-2 overflow-hidden transition-all ${selectedAvatar === avatar.avatar_id ? "border-brand-500 shadow-lg shadow-brand-500/20" : "border-white/5 hover:border-white/20"}`}>
                    {avatar.preview_image_url ? <img src={avatar.preview_image_url} alt={avatar.avatar_name} className="w-full aspect-square object-cover" /> : <div className="w-full aspect-square bg-dark-900 flex items-center justify-center"><span className="text-2xl">\ud83e\uddd1</span></div>}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2"><p className="text-xs text-white font-medium truncate">{avatar.avatar_name}</p></div>
                    {selectedAvatar === avatar.avatar_id && <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">\u2713</span></div>}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep("script")} className="px-6 py-3 bg-dark-900 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">\u2190 Back to Script</button>
            {avatars.length > 0 && <button onClick={generateVideo} disabled={!selectedAvatar} className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-3 transition-colors text-sm">\ud83c\udfac Generate Video \u2192</button>}
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-700/20 rounded-full mb-6"><svg className="animate-spin w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
          <h2 className="text-2xl font-bold mb-2">Generating Your Video</h2>
          <p className="text-gray-400 text-sm mb-4">HeyGen is rendering your AI avatar video. This usually takes 2-5 minutes.</p>
          <div className="inline-flex items-center gap-2 bg-dark-900 border border-white/10 rounded-full px-4 py-2 text-xs text-gray-400"><span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />Video ID: {videoId}</div>
          {videoStatus === "failed" && <div className="mt-6"><button onClick={() => setStep("avatar")} className="px-6 py-3 bg-dark-900 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">\u2190 Try Again</button></div>}
        </div>
      )}

      {step === "done" && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4"><span className="text-3xl">\ud83c\udf89</span></div>
            <h2 className="text-2xl font-bold mb-1">Video Ready!</h2>
            <p className="text-gray-400 text-sm">Your AI-generated UGC video is ready to download.{videoDuration && ` Duration: ${Math.round(videoDuration)}s`}</p>
          </div>
          {videoUrl && <div className="max-w-sm mx-auto mb-6"><div className="rounded-2xl overflow-hidden border border-white/10 bg-black"><video src={videoUrl} controls poster={thumbnailUrl || undefined} className="w-full" playsInline /></div></div>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {videoUrl && <a href={videoUrl} target="_blank" rel="noopener noreferrer" download className="bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl px-6 py-3 transition-colors text-sm text-center">\u2b07\ufe0f Download Video</a>}
            <button onClick={resetPipeline} className="px-6 py-3 bg-dark-900 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">\ud83d\udd04 Create Another Video</button>
          </div>
        </div>
      )}
    </div>
  );
}
