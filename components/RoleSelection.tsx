"use client";

interface Props {
  onSelectFan: () => void;
  onSelectCreator: () => void;
}

export default function RoleSelection({ onSelectFan, onSelectCreator }: Props) {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SpotifyIcon className="w-10 h-10 text-[#1DB954]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Superfan Hub</h1>
        <p className="text-[#B3B3B3] text-base max-w-sm">
          Who are you joining us as today?
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col md:flex-row gap-5 w-full max-w-2xl animate-pop-in">
        {/* Fan Card */}
        <button
          onClick={onSelectFan}
          className="group flex-1 bg-[#181818] hover:bg-[#282828] border border-white/10 hover:border-[#1DB954]/60 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1DB954]/10 active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-[#1DB954]/15 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1DB954]/25 transition-colors">
            <span className="text-3xl">🎧</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">I am a Fan</h2>
          <p className="text-[#B3B3B3] text-sm leading-relaxed mb-6">
            Discover and subscribe to your favorite artists. Unlock exclusive content, vote on tours, and connect directly.
          </p>
          <div className="space-y-2">
            {[
              "Exclusive feeds and raw demos",
              "Priority comments on tracks",
              "Early concert ticket access",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-2">
                <span className="text-[#1DB954] text-xs">✓</span>
                <span className="text-white/80 text-xs">{perk}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#1DB954] text-black font-bold text-sm py-3 rounded-full text-center group-hover:bg-[#1ed760] transition-colors">
            Enter as Fan
          </div>
        </button>

        {/* Creator Card */}
        <button
          onClick={onSelectCreator}
          className="group flex-1 bg-[#181818] hover:bg-[#282828] border border-white/10 hover:border-purple-500/60 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-purple-500/15 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-purple-500/25 transition-colors">
            <span className="text-3xl">🎤</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">I am a Creator</h2>
          <p className="text-[#B3B3B3] text-sm leading-relaxed mb-6">
            Launch your Superfan subscription, access analytics, run A/B campaigns, and build a direct revenue stream from your most loyal listeners.
          </p>
          <div className="space-y-2">
            {[
              "Revenue calculator & MRR tracker",
              "AI-powered fan insights & A/B tests",
              "Commerce, payout & anti-fraud tools",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-2">
                <span className="text-purple-400 text-xs">✓</span>
                <span className="text-white/80 text-xs">{perk}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3 rounded-full text-center transition-colors">
            Enter as Creator
          </div>
        </button>
      </div>

      <p className="text-[#B3B3B3] text-xs mt-10 animate-fade-in">
        You can switch roles anytime from your profile settings.
      </p>
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
