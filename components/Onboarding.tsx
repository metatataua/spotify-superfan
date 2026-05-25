"use client";
import { useState } from "react";

interface Props {
  onComplete: () => void;
}

type TourStep = {
  highlight: "home" | "sidebar" | "superfan";
  title: string;
  description: string;
  cta: string;
  context: string; /* shown as a highlighted chip on mobile so users know what's being pointed at */
};

const TOUR: TourStep[] = [
  {
    highlight: "home",
    title: "Your Spotify Home",
    description:
      "This is your regular Spotify experience — music, podcasts, and playlists. But something exciting has just arrived for true fans.",
    cta: "Next →",
    context: "Main Dashboard Grid",
  },
  {
    highlight: "sidebar",
    title: "Your Navigation Sidebar",
    description:
      "Your sidebar gives you quick access to everything you love on Spotify. We have added a brand-new destination right inside it.",
    cta: "Next →",
    context: "Sidebar Navigation Menu",
  },
  {
    highlight: "superfan",
    title: "Introducing: Superfan Hub!",
    description:
      "A dedicated space where you connect directly with your favorite artists — exclusive content, polls, early tickets, and more.",
    cta: "Go to Superfan Hub →",
    context: "Superfan Hub — New Nav Link",
  },
];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<"welcome" | number>("welcome");

  const advance = () => {
    if (step === "welcome") { setStep(0); return; }
    const n = (step as number) + 1;
    if (n < TOUR.length) setStep(n);
    else onComplete();
  };

  const currentTour = typeof step === "number" ? TOUR[step] : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* ── Background Spotify shell ── */}
      <SpotifyShell highlight={currentTour?.highlight ?? null} />

      {/* ── Dark overlay with cutout hints per step ── */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ── Content ── */}
      {step === "welcome" ? (
        <WelcomeModal onNext={advance} />
      ) : (
        <TooltipCard
          step={currentTour!}
          index={step as number}
          total={TOUR.length}
          onNext={advance}
        />
      )}
    </div>
  );
}

/* ─────────────── Welcome Modal ─────────────── */
function WelcomeModal({ onNext }: { onNext: () => void }) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-md px-4">
      <div className="bg-[#181818] rounded-2xl p-6 sm:p-8 w-full animate-pop-in border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <SpotifyIcon className="w-9 h-9 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Meet Spotify Superfan!</h1>
          <p className="text-[#B3B3B3] text-sm leading-relaxed">
            The next evolution in fan-artist connection. Experience music like never before.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            { icon: "🎵", text: "Exclusive tracks and raw behind-the-scenes content" },
            { icon: "🗳️", text: "Vote on tour cities, setlists, and album artwork" },
            { icon: "🎟️", text: "48-hour priority access to concert presale tickets" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#282828] rounded-xl p-3">
              <span className="text-xl">{b.icon}</span>
              <span className="text-sm text-white">{b.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Start Tour →
        </button>

        <p className="text-center text-[#B3B3B3] text-xs mt-4">Takes less than 30 seconds</p>
      </div>
    </div>
  );
}

/* ─────────────── Tour Tooltip Card ─────────────── */
function TooltipCard({
  step, index, total, onNext,
}: {
  step: TourStep; index: number; total: number; onNext: () => void;
}) {
  /* Desktop: positioned next to the highlighted sidebar element.
     Mobile (< md): fixed, centered on screen like a modal sheet. */
  const desktopPos: Record<string, string> = {
    home:     "md:left-[270px] md:top-[100px]",
    sidebar:  "md:left-[270px] md:top-1/2 md:-translate-y-1/2",
    superfan: "md:left-[270px] md:bottom-[90px]",
  };

  return (
    <div
      key={index}
      className={`
        fixed bottom-0 left-0 right-0 z-20 animate-slide-up
        md:absolute md:bottom-auto md:left-auto md:right-auto
        ${desktopPos[step.highlight]}
        p-4 md:p-0
      `}
    >
      {/* Arrow — desktop only */}
      <div className="hidden md:block absolute left-[-10px] top-6 w-0 h-0 border-y-8 border-y-transparent border-r-[10px] border-r-[#181818]" />

      <div className="bg-[#181818] border border-[#1DB954]/40 rounded-2xl p-5 w-full md:max-w-xs shadow-2xl shadow-black/60">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#1DB954]" : i < index ? "w-3 bg-[#1DB954]/50" : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Context indicator — always visible, essential on mobile where shell is hidden */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] text-[#B3B3B3] uppercase tracking-widest font-semibold">Context:</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
            [{step.context}]
          </span>
        </div>
        <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
        <p className="text-[#B3B3B3] text-sm leading-relaxed mb-5">{step.description}</p>

        <button
          onClick={onNext}
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-2.5 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {step.cta}
        </button>

        <p className="text-[#B3B3B3] text-xs text-center mt-3">
          Step {index + 1} of {total}
        </p>
      </div>
    </div>
  );
}

/* ─────────────── Static Spotify Shell (tour background) ─────────────── */
function SpotifyShell({ highlight }: { highlight: string | null }) {
  const isHL = (key: string) => highlight === key;
  const hlCls = (key: string) =>
    isHL(key)
      ? "ring-2 ring-[#1DB954] shadow-[0_0_32px_rgba(29,185,84,0.8)] bg-[#1a2a1a]"
      : "opacity-40";

  return (
    <div className="absolute inset-0 flex overflow-hidden select-none pointer-events-none">
      {/* ── Sidebar ── */}
      <aside className={`hidden md:flex w-60 bg-black flex-col gap-2 p-2 shrink-0 transition-all rounded-r-xl ${isHL("sidebar") ? "ring-2 ring-[#1DB954] shadow-[0_0_40px_rgba(29,185,84,0.7)] bg-[#0a1a0a]" : "opacity-50"}`}>
        <div className="flex items-center gap-2 px-4 py-3">
          <SpotifyIcon className="w-8 h-8 text-[#1DB954]" />
          <span className="text-white font-bold text-lg tracking-tight">Spotify</span>
        </div>

        {/* Nav box */}
        <div className={`rounded-xl p-3 space-y-1 transition-all ${hlCls("home")} ${isHL("home") ? "border border-[#1DB954]/60" : "bg-[#121212]"}`}>
          {isHL("home") && (
            <p className="text-[#1DB954] text-[10px] font-bold px-3 pb-1 uppercase tracking-widest">← Your Home Page</p>
          )}
          {[
            { icon: "🏠", label: "Home" },
            { icon: "🔍", label: "Search" },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isHL("home") && item.label === "Home" ? "bg-[#1DB954]/20" : ""}`}>
              <span>{item.icon}</span>
              <span className="text-white font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Library */}
        <div className="bg-[#121212] rounded-xl p-3 flex-1 space-y-1 opacity-50">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-sm">📚</span>
            <span className="text-[#B3B3B3] font-semibold text-sm">Your Library</span>
          </div>
          {["Liked Songs", "My Playlist #1", "Chill Vibes"].map((pl) => (
            <div key={pl} className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-[#282828] rounded flex-shrink-0" />
              <span className="text-[#B3B3B3] text-xs truncate">{pl}</span>
            </div>
          ))}
        </div>

        {/* Superfan Hub */}
        <div className={`rounded-xl p-3 transition-all ${isHL("superfan") ? "bg-[#0d1f0d] border-2 border-[#1DB954] shadow-[0_0_30px_rgba(29,185,84,0.7)]" : "bg-[#121212] opacity-50"}`}>
          {isHL("superfan") && (
            <p className="text-[#1DB954] text-[10px] font-bold px-3 pb-1 uppercase tracking-widest">← Superfan Hub (new)</p>
          )}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="text-[#1DB954] text-lg">⭐</span>
            <span className="text-[#1DB954] font-bold text-sm">Superfan Hub</span>
            <span className="ml-auto bg-[#1DB954] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className={`flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#121212] transition-all ${isHL("home") ? "ring-2 ring-[#1DB954]/40 shadow-[inset_0_0_40px_rgba(29,185,84,0.08)]" : isHL("sidebar") || isHL("superfan") ? "opacity-30" : ""}`}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-[#282828] rounded-full opacity-60" />
            <div className="w-8 h-8 bg-[#282828] rounded-full opacity-60" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#282828] rounded-full" />
            <span className="text-sm text-white font-semibold hidden sm:block">Your Name</span>
          </div>
        </header>

        {/* Content grid */}
        <div className="flex-1 p-6 overflow-hidden">
          <h2 className="text-white font-bold text-2xl mb-5 opacity-70">Good Evening</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {["Recently Played", "Liked Songs", "Daily Mix 1", "Release Radar", "Discover Weekly", "Top Songs"].map(
              (name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 bg-[#282828]/60 rounded-lg overflow-hidden h-14"
                >
                  <div className="w-14 h-14 bg-[#1DB954]/20 flex-shrink-0" />
                  <span className="text-white text-sm font-semibold truncate pr-2">{name}</span>
                </div>
              )
            )}
          </div>
          <h2 className="text-white font-bold text-xl mb-4 opacity-60">Your Top Artists</h2>
          <div className="flex gap-4">
            {["Luna Waves", "Aria Storm", "Iron Pulse"].map((a) => (
              <div key={a} className="flex flex-col items-center gap-2 w-28">
                <div className="w-24 h-24 bg-[#282828] rounded-full" />
                <span className="text-white text-xs text-center font-medium">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpotifyIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
