"use client";
import { useState, useEffect, useRef } from "react";
import type { AppState, Theme, PollVotes } from "@/lib/types";

/* ─── Artist data ─── */
export const ARTISTS = [
  {
    id: 1,
    name: "Luna Waves",
    genre: "Indie / DIY",
    price: 4.99,
    subscribers: "12.4K",
    emoji: "🌊",
    theme: { primary: "#1DB954", secondary: "#0d9c40", accent: "#57FF96" },
    bio: "Indie songwriter crafting lo-fi dreamscapes from her home studio in Berlin.",
    latestTrack: "Midnight Drift (Demo)",
    superfanCount: 1245,
    topCities: ["Kyiv", "Berlin", "London"],
    tier: "DIY / Indie",
  },
  {
    id: 2,
    name: "Aria Storm",
    genre: "Pop Star",
    price: 9.99,
    subscribers: "284K",
    emoji: "⚡",
    theme: { primary: "#E040FB", secondary: "#AA00FF", accent: "#FF80AB" },
    bio: "Chart-topping pop force with an electrifying live show and global fanbase.",
    latestTrack: "Electric Pulse (Raw Cut)",
    superfanCount: 28450,
    topCities: ["New York", "Paris", "LA"],
    tier: "Pop Star",
  },
  {
    id: 3,
    name: "Iron Pulse",
    genre: "Rock",
    price: 4.99,
    subscribers: "67.8K",
    emoji: "🎸",
    theme: { primary: "#FF5722", secondary: "#E64A19", accent: "#FF8A65" },
    bio: "Hard-hitting rock trio pushing the boundaries of modern alternative music.",
    latestTrack: "Concrete Jungle (Rough Mix)",
    superfanCount: 5672,
    topCities: ["London", "Berlin", "Warsaw"],
    tier: "Rock",
  },
];

interface Props {
  appState: AppState;
  theme: Theme;
  selectedArtistId: number;
  setSelectedArtistId: (id: number) => void;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  pollVotes: PollVotes;
  setPollVotes: (v: PollVotes) => void;
  userVote: string | null;
  setUserVote: (v: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  onGoHome: () => void;
}

type FanScreen = "hub" | "artist_profile" | "feed";
type PaymentStep = "idle" | "open" | "loading" | "viral";

export default function FanView(props: Props) {
  const {
    appState, selectedArtistId, setSelectedArtistId,
    onSubscribe, onUnsubscribe, pollVotes, setPollVotes,
    userVote, setUserVote, isPlaying, setIsPlaying, onGoHome,
  } = props;

  const [screen, setScreen] = useState<FanScreen>("hub");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle");
  const [shareShown, setShareShown] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState<{ text: string; tier: number }[]>([
    { text: "This unreleased track already hits different 🔥", tier: 1 },
    { text: "Luna please come to Kyiv, we've been waiting forever!", tier: 2 },
  ]);
  const [commentInput, setCommentInput] = useState("");
  const [progressSec, setProgressSec] = useState(37);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* unsubscribe flow */
  const [unsubscribeOpen, setUnsubscribeOpen]     = useState(false);
  const [unsubReason, setUnsubReason]             = useState("Too expensive");
  const [cancelBanner, setCancelBanner]           = useState(false);

  const artist = ARTISTS.find((a) => a.id === selectedArtistId)!;
  const p = artist.theme.primary;
  const isSubscribed = appState === "fan_subscribed";

  /* audio progress ticker */
  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setProgressSec((s) => (s >= 183 ? 0 : s + 1));
      }, 1000);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [isPlaying]);

  /* payment flow */
  const handleConfirmPay = () => {
    setPaymentStep("loading");
    setTimeout(() => {
      setPaymentStep("viral");
      onSubscribe();
    }, 1500);
  };

  const handleShareInstagram = () => {
    setShareShown(true);
    setTimeout(() => setShareShown(false), 2000);
  };

  const handleVote = (city: string) => {
    if (userVote) return;
    setUserVote(city);
    setPollVotes({ ...pollVotes, [city]: pollVotes[city as keyof PollVotes] + 1 });
  };

  const totalPollVotes = pollVotes.Kyiv + pollVotes.Lviv + pollVotes.London;
  const pct = (city: keyof PollVotes) => Math.round((pollVotes[city] / totalPollVotes) * 100);

  const submitComment = () => {
    if (!commentInput.trim()) return;
    setComments([{ text: commentInput.trim(), tier: 3 }, ...comments]);
    setCommentInput("");
  };

  const handleUnsubscribeConfirm = () => {
    setUnsubscribeOpen(false);
    setCancelBanner(true);
    setTimeout(() => setCancelBanner(false), 4000);
    onUnsubscribe();
    setScreen("hub");
  };

  /* navigate back to hub when we switch artists */
  const selectArtist = (id: number) => {
    setSelectedArtistId(id);
    setScreen("artist_profile");
    setPaymentStep("idle");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#121212]">
      {/* ── Mobile top bar (hidden on desktop where sidebar exists) ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black border-b border-white/10 shrink-0">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-[#B3B3B3] hover:text-white text-sm font-medium transition-colors"
        >
          ← Exit Hub to Role Selection
        </button>
        <div className="flex items-center gap-1.5">
          <SpotifyIcon className="w-5 h-5 text-[#1DB954]" />
          <span className="text-white font-bold text-sm">Superfan Hub</span>
        </div>
      </div>

      {/* ── Cancellation success banner ── */}
      {cancelBanner && (
        <div className="animate-slide-up bg-[#1a3a1a] border-b border-[#1DB954]/40 px-5 py-3 flex items-center gap-3 shrink-0">
          <span className="text-[#1DB954] text-lg">✓</span>
          <p className="text-white text-sm">
            <strong>Subscription canceled.</strong> Access remains until the end of the billing period.
          </p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <Sidebar
          artist={isSubscribed ? artist : null}
          onGoHome={onGoHome}
          onHubClick={() => setScreen("hub")}
          active={screen}
        />

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a2e] via-[#181818] to-[#121212]">
          {screen === "hub" && (
            <HubShowcase artists={ARTISTS} onSelectArtist={selectArtist} />
          )}
          {screen === "artist_profile" && !isSubscribed && (
            <ArtistProfile
              artist={artist}
              onSubscribe={() => setPaymentStep("open")}
            />
          )}
          {(screen === "artist_profile" && isSubscribed) || (screen === "feed") ? (
            <SuperfanFeed
              artist={artist}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pollVotes={pollVotes}
              userVote={userVote}
              handleVote={handleVote}
              pct={pct}
              totalPollVotes={totalPollVotes}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              progressSec={progressSec}
              comments={comments}
              commentInput={commentInput}
              setCommentInput={setCommentInput}
              submitComment={submitComment}
              onUnsubscribeClick={() => setUnsubscribeOpen(true)}
            />
          ) : null}
        </main>
      </div>

      {/* ── Persistent Player ── */}
      <BottomPlayer
        artist={isSubscribed ? artist : null}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        progressSec={progressSec}
      />

      {/* ── Payment Modal ── */}
      {paymentStep !== "idle" && paymentStep !== "viral" && (
        <PaymentModal
          artist={artist}
          step={paymentStep}
          onConfirm={handleConfirmPay}
          onClose={() => setPaymentStep("idle")}
        />
      )}

      {/* ── Viral Share Card ── */}
      {paymentStep === "viral" && (
        <ViralShareCard
          artist={artist}
          shareShown={shareShown}
          onShare={handleShareInstagram}
          onClose={() => { setPaymentStep("idle"); setScreen("feed"); }}
        />
      )}

      {/* ── Unsubscribe Modal ── */}
      {unsubscribeOpen && (
        <UnsubscribeModal
          artist={artist}
          reason={unsubReason}
          setReason={setUnsubReason}
          onConfirm={handleUnsubscribeConfirm}
          onClose={() => setUnsubscribeOpen(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════ UNSUBSCRIBE MODAL ═══════════════ */
function UnsubscribeModal({
  artist, reason, setReason, onConfirm, onClose,
}: {
  artist: (typeof ARTISTS)[0];
  reason: string;
  setReason: (r: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const p = artist.theme.primary;
  const options = ["Too expensive", "Content is inactive", "Just testing the feature", "Switching to another artist", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C1C1C] w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">We are sad to see you leave! 😢</h2>
            <p className="text-[#B3B3B3] text-xs mt-1">
              Please let <strong className="text-white">{artist.name}</strong> know why you decided to unsubscribe.
            </p>
          </div>
          <button onClick={onClose} className="text-[#B3B3B3] hover:text-white text-2xl leading-none ml-3 flex-shrink-0">×</button>
        </div>

        {/* Radio options */}
        <div className="space-y-2 mb-6">
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                reason === opt
                  ? "border-[#B3B3B3]/60 bg-white/5"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  reason === opt ? "border-white" : "border-white/30"
                }`}
              >
                {reason === opt && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name="unsub-reason"
                value={opt}
                checked={reason === opt}
                onChange={() => setReason(opt)}
                className="sr-only"
              />
              <span className="text-white text-sm">{opt}</span>
            </label>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-full font-bold text-sm bg-black text-white border border-white/20 hover:bg-[#1a1a1a] transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          Confirm Cancellation
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 mt-2 text-[#B3B3B3] hover:text-white text-sm transition-colors"
        >
          Keep my Superfan subscription
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ SIDEBAR ═══════════════ */
function Sidebar({
  artist, onGoHome, onHubClick, active,
}: {
  artist: (typeof ARTISTS)[0] | null;
  onGoHome: () => void;
  onHubClick: () => void;
  active: FanScreen;
}) {
  const p = artist?.theme.primary ?? "#1DB954";
  return (
    <aside className="hidden md:flex w-60 bg-black flex-col gap-2 p-2 shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={onGoHome}>
        <SpotifyIcon className="w-8 h-8 text-[#1DB954]" />
        <span className="text-white font-bold text-lg">Spotify</span>
      </div>

      {/* Nav */}
      <div className="bg-[#121212] rounded-xl p-3 space-y-1">
        <NavItem icon="🏠" label="Home" onClick={onGoHome} />
        <NavItem icon="🔍" label="Search" onClick={() => {}} />
      </div>

      {/* Library */}
      <div className="bg-[#121212] rounded-xl p-3 flex-1 space-y-1">
        <div className="flex items-center justify-between px-3 py-2 opacity-70">
          <span className="text-[#B3B3B3] font-semibold text-sm">Your Library</span>
          <span className="text-[#B3B3B3] text-lg cursor-pointer">+</span>
        </div>
        {["Liked Songs", "Lo-Fi Study Mix", "Rock Anthems"].map((pl) => (
          <div key={pl} className="flex items-center gap-3 px-3 py-2 hover:bg-[#282828] rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-[#282828] rounded flex-shrink-0" />
            <span className="text-[#B3B3B3] text-xs truncate">{pl}</span>
          </div>
        ))}
      </div>

      {/* Superfan Hub */}
      <div
        className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
        style={{ backgroundColor: `${p}22`, border: `1px solid ${p}44` }}
        onClick={onHubClick}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <span style={{ color: p }}>⭐</span>
          <span style={{ color: p }} className="font-bold text-sm">Superfan Hub</span>
          {artist && (
            <span
              className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full text-black"
              style={{ backgroundColor: p }}
            >
              ACTIVE
            </span>
          )}
        </div>
        {artist && (
          <div className="px-3 pb-1">
            <p className="text-white/60 text-xs">Subscribed to</p>
            <p className="text-white text-xs font-bold truncate">{artist.name}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#282828] text-left transition-colors"
    >
      <span>{icon}</span>
      <span className="text-white font-medium text-sm">{label}</span>
    </button>
  );
}

/* ═══════════════ HUB SHOWCASE ═══════════════ */
function HubShowcase({
  artists, onSelectArtist,
}: {
  artists: typeof ARTISTS;
  onSelectArtist: (id: number) => void;
}) {
  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Superfan Hub</h1>
        <p className="text-[#B3B3B3] text-sm">Recommended artists based on your taste (Rock, Pop, Indie)</p>
      </div>

      {/* Artist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <button
            key={artist.id}
            onClick={() => onSelectArtist(artist.id)}
            className="group bg-[#181818] hover:bg-[#282828] rounded-xl p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            style={{ boxShadow: `0 0 0 0 ${artist.theme.primary}` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${artist.theme.primary}30`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            {/* Avatar */}
            <div
              className="w-full h-40 rounded-xl mb-4 flex items-center justify-center text-6xl font-bold relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${artist.theme.primary}44, ${artist.theme.secondary}22)` }}
            >
              <span>{artist.emoji}</span>
              <div
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: artist.theme.primary, color: "#000" }}
              >
                {artist.tier}
              </div>
            </div>

            {/* Info */}
            <h3 className="text-white font-bold text-base mb-1">{artist.name}</h3>
            <p className="text-[#B3B3B3] text-xs mb-3">{artist.genre} · {artist.subscribers} monthly listeners</p>

            {/* Price CTA */}
            <div
              className="text-center py-2.5 rounded-full font-bold text-sm text-black transition-all group-hover:scale-105"
              style={{ backgroundColor: artist.theme.primary }}
            >
              Become a Superfan for ${artist.price.toFixed(2)}/mo
            </div>
          </button>
        ))}
      </div>

      {/* Genre Pills */}
      <div className="mt-8">
        <h2 className="text-white font-bold text-lg mb-3">Browse by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {["Rock", "Pop", "Indie", "Electronic", "Hip-Hop", "R&B", "Jazz", "Classical"].map((g) => (
            <span
              key={g}
              className="px-4 py-2 bg-[#282828] hover:bg-[#383838] rounded-full text-white text-sm cursor-pointer transition-colors"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ARTIST PROFILE (unsubscribed) ═══════════════ */
function ArtistProfile({
  artist, onSubscribe,
}: {
  artist: (typeof ARTISTS)[0];
  onSubscribe: () => void;
}) {
  const p = artist.theme.primary;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div
        className="relative h-56 md:h-72 flex items-end p-6"
        style={{ background: `linear-gradient(180deg, ${p}55 0%, #121212 100%)` }}
      >
        <div className="flex items-end gap-5">
          <div
            className="w-28 h-28 rounded-xl flex items-center justify-center text-5xl shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${p}66, ${artist.theme.secondary}44)` }}
          >
            {artist.emoji}
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Artist</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{artist.name}</h1>
            <p className="text-[#B3B3B3] text-sm mt-1">{artist.subscribers} monthly listeners</p>
          </div>
        </div>
      </div>

      {/* Superfan Benefits */}
      <div className="px-6 py-6">
        <div
          className="rounded-2xl p-6 mb-6 border"
          style={{ background: `${p}11`, borderColor: `${p}33` }}
        >
          <h2 className="text-white font-bold text-lg mb-4">
            <span style={{ color: p }}>⭐ </span>Superfan Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "📰",
                title: "Exclusive News Feed",
                desc: "Early access to artist thoughts, raw backstage photos, unreleased audio demos, and behind-the-scenes vlogs.",
              },
              {
                icon: "🗳️",
                title: "Co-Creation & Voting",
                desc: "Direct participation in official polls — choose tracks for the live setlist, vote on album cover art, select tour cities.",
              },
              {
                icon: "💬",
                title: "Priority Comments",
                desc: "ONLY Superfans can comment on tracks. Your comments feature glowing color outlines and are pinned to the top.",
              },
              {
                icon: "🛍️",
                title: "Priority E-commerce",
                desc: "Early access to ultra-limited merch drops, 48-hour presale concert tickets, and subscriber-only discounts.",
              },
            ].map((b) => (
              <div key={b.title} className="bg-[#181818] rounded-xl p-4">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{b.title}</h3>
                <p className="text-[#B3B3B3] text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blurred content preview */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <div className="blur-md pointer-events-none select-none p-5 bg-[#181818]">
            <h3 className="text-white font-bold mb-3">Exclusive Superfan Feed</h3>
            <div className="space-y-3">
              {[
                "Just finished recording the bridge for track 3... it sounds completely different from anything I've done before 🎵",
                "Raw studio session photos from last night 📸",
                "POLL: Which city should we announce next for the autumn tour?",
              ].map((t, i) => (
                <div key={i} className="bg-[#282828] rounded-lg p-3 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#383838] flex-shrink-0" />
                  <p className="text-white text-sm">{t}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-xl bg-black/50">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-white font-bold text-center">Subscribe to unlock exclusive content</p>
            <p className="text-[#B3B3B3] text-sm mt-1">Join {artist.superfanCount.toLocaleString()} superfans</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSubscribe}
          className="w-full py-4 rounded-full font-bold text-lg text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-glow-pulse"
          style={{
            backgroundColor: p,
            "--glow-color": p,
          } as React.CSSProperties}
        >
          Become a Superfan for ${artist.price.toFixed(2)}/mo
        </button>
        <p className="text-[#B3B3B3] text-xs text-center mt-3">
          Cancel anytime · Instant access · {artist.superfanCount.toLocaleString()} fans already subscribed
        </p>
      </div>
    </div>
  );
}

/* ═══════════════ PAYMENT MODAL ═══════════════ */
function PaymentModal({
  artist, step, onConfirm, onClose,
}: {
  artist: (typeof ARTISTS)[0];
  step: "open" | "loading";
  onConfirm: () => void;
  onClose: () => void;
}) {
  const p = artist.theme.primary;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1C1C1C] w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Confirm Subscription</h2>
          {step === "open" && (
            <button onClick={onClose} className="text-[#B3B3B3] hover:text-white text-2xl leading-none">×</button>
          )}
        </div>

        {/* Artist info */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl mb-5"
          style={{ background: `${p}15`, border: `1px solid ${p}33` }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${p}33` }}
          >
            {artist.emoji}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">{artist.name}</p>
            <p className="text-[#B3B3B3] text-xs">Superfan Subscription · Monthly</p>
          </div>
          <p className="text-white font-bold text-lg">${artist.price.toFixed(2)}</p>
        </div>

        {/* Payment method */}
        <div className="bg-[#282828] rounded-xl p-4 mb-5">
          <p className="text-[#B3B3B3] text-xs mb-1 font-semibold uppercase tracking-wide">Payment Method</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
              <span className="text-[8px] font-black text-blue-600">VISA</span>
            </div>
            <p className="text-white text-sm">Payment via saved Spotify Premium card (•••• 1234)</p>
          </div>
        </div>

        {/* Fine print */}
        <p className="text-[#B3B3B3] text-[11px] leading-relaxed mb-5">
          🔁 Monthly recurring subscription. The next automatic charge of ${artist.price.toFixed(2)} will occur exactly in one month. You can cancel anytime in your profile settings. 🔒 Since digital content access and priority comments are unlocked instantly, cancellation applies to the next billing period, and no refunds are issued for the current month in accordance with creator protection policies.
        </p>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          disabled={step === "loading"}
          className="w-full py-4 rounded-full font-bold text-base text-black flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-90"
          style={{ backgroundColor: p }}
        >
          {step === "loading" ? (
            <>
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin-custom" />
              Processing…
            </>
          ) : (
            "Confirm & Pay"
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ VIRAL SHARE CARD ═══════════════ */
function ViralShareCard({
  artist, shareShown, onShare, onClose,
}: {
  artist: (typeof ARTISTS)[0];
  shareShown: boolean;
  onShare: () => void;
  onClose: () => void;
}) {
  const p = artist.theme.primary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs animate-pop-in">
        {/* Story card */}
        <div
          className="rounded-3xl p-6 mb-4 relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${p}33 0%, #000 60%)`, border: `1px solid ${p}66` }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
            style={{ backgroundColor: p, filter: "blur(40px)" }} />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-15"
            style={{ backgroundColor: artist.theme.accent, filter: "blur(35px)" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
              <span className="text-white font-bold text-sm">Spotify Superfan</span>
            </div>

            <p className="text-white font-bold text-lg leading-tight mb-4">
              I have officially joined the Superfan Pool for {artist.name}!
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 font-bold text-black text-sm"
              style={{ backgroundColor: p }}
            >
              {artist.emoji} My Personal Number: #1,245
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["Exclusive Demos 🎧", "Early Tickets 🎫", "Music Voting 🗳️"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${p}22`, color: p, border: `1px solid ${p}44` }}
                >
                  {badge}
                </span>
              ))}
            </div>

            <button
              onClick={onShare}
              className="w-full py-3 rounded-full font-bold text-black text-sm relative overflow-hidden"
              style={{ backgroundColor: p }}
            >
              {shareShown ? (
                <span className="animate-success-pop inline-block">✓ Shared Successfully!</span>
              ) : (
                "[Share to Instagram Stories]"
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#282828] hover:bg-[#383838] text-white font-bold text-sm transition-colors"
        >
          Continue to Superfan Feed →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ SUPERFAN FEED (Step 5) ═══════════════ */
function SuperfanFeed({
  artist, activeTab, setActiveTab,
  pollVotes, userVote, handleVote, pct, totalPollVotes,
  isPlaying, setIsPlaying, progressSec,
  comments, commentInput, setCommentInput, submitComment,
  onUnsubscribeClick,
}: {
  artist: (typeof ARTISTS)[0];
  activeTab: number;
  setActiveTab: (n: number) => void;
  pollVotes: PollVotes;
  userVote: string | null;
  handleVote: (c: string) => void;
  pct: (c: keyof PollVotes) => number;
  totalPollVotes: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  progressSec: number;
  comments: { text: string; tier: number }[];
  commentInput: string;
  setCommentInput: (v: string) => void;
  submitComment: () => void;
  onUnsubscribeClick: () => void;
}) {
  const p = artist.theme.primary;
  const tierColors = ["#1DB954", "#E040FB", "#FF5722"];

  return (
    <div className="animate-fade-in" style={{ "--theme-primary": p } as React.CSSProperties}>
      {/* Artist header */}
      <div
        className="relative flex items-end p-6 pt-10"
        style={{ background: `linear-gradient(180deg, ${p}55 0%, #121212 100%)`, minHeight: "12rem" }}
      >
        <div className="flex items-end justify-between w-full gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${p}44` }}
            >
              {artist.emoji}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{artist.name}</h1>
              <p className="text-sm" style={{ color: p }}>
                ⭐ Superfan #18 · {artist.superfanCount.toLocaleString()} fans
              </p>
            </div>
          </div>
          {/* Unsubscribe entry point */}
          <button
            onClick={onUnsubscribeClick}
            className="text-[#B3B3B3] hover:text-white text-xs border border-white/20 hover:border-white/50 rounded-full px-3 py-1.5 transition-all flex-shrink-0"
          >
            Unsubscribe from Superfan Hub
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="sticky top-0 z-10 bg-[#121212] border-b border-white/10 px-6 flex gap-0">
        {["Superfan Feed", "Spotify Messages"].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === i
                ? "border-current text-white"
                : "border-transparent text-[#B3B3B3] hover:text-white"
            }`}
            style={activeTab === i ? { borderColor: p, color: p } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Superfan Feed */}
      {activeTab === 0 && (
        <div className="p-6 space-y-5 max-w-2xl">
          {/* Thought post */}
          <div className="bg-[#181818] rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${p}33` }}
              >
                {artist.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{artist.name}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: p }}
                  >
                    SUPERFAN ONLY
                  </span>
                </div>
                <p className="text-[#B3B3B3] text-xs mt-0.5">2 hours ago</p>
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed mb-4">
              Just finished the bridge for track 3 in the studio... it sounds completely different from anything I've done before. Raw and vulnerable. Sharing it with you first before anyone else hears it. 🎵✨
            </p>
            {/* Photo grid */}
            <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
              {["🎛️", "🎸", "🎙️"].map((icon, i) => (
                <div
                  key={i}
                  className="h-24 flex items-center justify-center text-3xl"
                  style={{ background: `linear-gradient(135deg, ${p}22, ${artist.theme.secondary}22)` }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Poll */}
          <div className="bg-[#181818] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🗳️</span>
              <span className="text-white font-bold text-sm">{artist.name}</span>
            </div>
            <p className="text-white font-semibold mb-4">Which city should we tour next?</p>
            <div className="space-y-2.5">
              {(["Kyiv", "Lviv", "London"] as (keyof PollVotes)[]).map((city) => (
                <button
                  key={city}
                  onClick={() => handleVote(city)}
                  disabled={!!userVote}
                  className="w-full relative rounded-lg overflow-hidden border text-left transition-all"
                  style={{
                    borderColor: userVote === city ? p : "rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Bar fill */}
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-700"
                    style={{
                      width: userVote ? `${pct(city)}%` : "0%",
                      backgroundColor: `${p}22`,
                    }}
                  />
                  <div className="relative flex items-center justify-between px-4 py-3">
                    <span className="text-white text-sm font-medium">
                      {city === "Kyiv" ? "🇺🇦" : city === "Lviv" ? "🇺🇦" : "🇬🇧"} {city}
                    </span>
                    {userVote && (
                      <span className="text-sm font-bold" style={{ color: p }}>
                        {pct(city)}%
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {userVote && (
              <p className="text-[#B3B3B3] text-xs mt-3 text-center">
                {totalPollVotes.toLocaleString()} superfans voted · Your vote: {userVote}
              </p>
            )}
            {!userVote && (
              <p className="text-[#B3B3B3] text-xs mt-3 text-center">Tap a city to cast your vote</p>
            )}
          </div>

          {/* Audio Preview */}
          <div
            className="bg-[#181818] rounded-2xl p-5 border"
            style={{ borderColor: `${p}33` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-bold text-sm">{artist.latestTrack}</p>
                <p style={{ color: p }} className="text-xs font-semibold">Superfan Exclusive · Unreleased</p>
              </div>
              {isPlaying && (
                <div className="bar-dance flex gap-1 h-5 items-end" style={{ color: p }}>
                  <span /><span /><span /><span />
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-white/10 rounded-full mb-3 cursor-pointer">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{ width: `${(progressSec / 183) * 100}%`, backgroundColor: p }}
              />
            </div>
            <div className="flex items-center justify-between text-[#B3B3B3] text-xs mb-4">
              <span>{formatTime(progressSec)}</span>
              <span>3:03</span>
            </div>

            <div className="flex items-center justify-center gap-5">
              <button className="text-[#B3B3B3] hover:text-white text-xl transition-colors">⏮</button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-black text-xl transition-all hover:scale-110 active:scale-95"
                style={{ backgroundColor: p }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="text-[#B3B3B3] hover:text-white text-xl transition-colors">⏭</button>
            </div>
          </div>

          {/* Aria Storm promo code reward (most popular artist — 284K listeners) */}
          {artist.id === 2 && (
            <div
              className="rounded-2xl p-5 border-2 animate-glow-pulse"
              style={{
                background: `linear-gradient(135deg, ${p}18, #121212)`,
                borderColor: p,
                "--glow-color": p,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-white font-bold text-sm">Exclusive Superfan Reward</p>
                  <p className="text-xs" style={{ color: p }}>Available to verified Superfans only</p>
                </div>
              </div>
              <p className="text-white text-sm leading-relaxed mb-3">
                Use code{" "}
                <span
                  className="font-black text-base tracking-widest px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: `${p}30`, color: p }}
                >
                  ARIA20
                </span>{" "}
                at checkout for a <strong>20% discount</strong> on official merch or tour tickets!
              </p>
              <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                <span>⏳</span>
                <span>Valid for 48 hours · Single use per Superfan account · Applies to all official store items</span>
              </div>
            </div>
          )}

          {/* Priority Comments */}
          <div className="bg-[#181818] rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">
              💬 Priority Comments
              <span
                className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
                style={{ color: p, backgroundColor: `${p}20` }}
              >
                Superfans Only
              </span>
            </h3>

            {/* Comment input */}
            <div className="flex gap-2 mb-4">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder="Share your thoughts with the artist…"
                className="flex-1 bg-[#282828] text-white text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-current placeholder-[#B3B3B3] transition-colors"
                style={{ "--tw-ring-color": p } as React.CSSProperties}
                onFocus={(e) => (e.target.style.borderColor = p)}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
              <button
                onClick={submitComment}
                className="px-4 py-3 rounded-xl font-bold text-black text-sm transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: p }}
              >
                Post
              </button>
            </div>

            {/* Comment list */}
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{
                    background: i === 0 && comments.length > 2 ? `${p}10` : "transparent",
                    border: i === 0 && comments.length > 2 ? `1px solid ${tierColors[Math.min(c.tier - 1, 2)]}66` : "1px solid transparent",
                    boxShadow: i === 0 && comments.length > 2 ? `0 0 12px ${tierColors[Math.min(c.tier - 1, 2)]}30` : "none",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: tierColors[Math.min(c.tier - 1, 2)], color: "#000" }}
                  >
                    #{c.tier}
                  </div>
                  <div>
                    {i === 0 && comments.length > 2 && (
                      <p className="text-[10px] font-bold mb-0.5" style={{ color: tierColors[Math.min(c.tier - 1, 2)] }}>
                        📌 Pinned · Superfan Tier {c.tier}
                      </p>
                    )}
                    <p className="text-white text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spotify Messages (Broadcast Channel) */}
      {activeTab === 1 && (
        <div className="p-6 max-w-2xl">
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: `${p}33` }}
          >
            {/* Channel header */}
            <div
              className="flex items-center gap-3 p-4"
              style={{ background: `linear-gradient(90deg, ${p}22, transparent)` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: `${p}33` }}
              >
                {artist.emoji}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{artist.name}</p>
                <p className="text-[#B3B3B3] text-xs">Broadcast Channel · {artist.superfanCount.toLocaleString()} members</p>
              </div>
              <span
                className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
                style={{ color: p, backgroundColor: `${p}20` }}
              >
                🔴 Live
              </span>
            </div>

            {/* Chat messages */}
            <div className="bg-[#181818] p-4 space-y-4 min-h-[300px]">
              {/* Synced thought post → bubble */}
              <ChatBubble
                avatar={artist.emoji}
                name={artist.name}
                isArtist
                color={p}
                time="2h ago"
                text="Just finished the bridge for track 3... sharing this with Superfans first before the world hears it. 🎵✨"
              />

              <ChatBubble
                avatar="🎧"
                name="You"
                isArtist={false}
                color={p}
                time="1h ago"
                text="This is incredible! Cannot wait for the full version."
              />

              {/* Synced poll */}
              <div className="ml-12">
                <div
                  className="rounded-xl p-4 max-w-xs border"
                  style={{ background: `${p}11`, borderColor: `${p}33` }}
                >
                  <p className="text-white text-sm font-semibold mb-3">🗳️ Which city should we tour next?</p>
                  <div className="space-y-2">
                    {(["Kyiv", "Lviv", "London"] as (keyof PollVotes)[]).map((city) => (
                      <button
                        key={city}
                        onClick={() => handleVote(city)}
                        disabled={!!userVote}
                        className="w-full relative rounded-lg overflow-hidden border text-left"
                        style={{ borderColor: userVote === city ? p : "rgba(255,255,255,0.1)" }}
                      >
                        <div
                          className="absolute inset-y-0 left-0 transition-all duration-700"
                          style={{ width: userVote ? `${pct(city)}%` : "0%", backgroundColor: `${p}22` }}
                        />
                        <div className="relative flex items-center justify-between px-3 py-2">
                          <span className="text-white text-xs">{city}</span>
                          {userVote && <span className="text-xs font-bold" style={{ color: p }}>{pct(city)}%</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                  {userVote && (
                    <p className="text-[#B3B3B3] text-[10px] mt-2">
                      ✓ Synced with Superfan Feed · {totalPollVotes} votes
                    </p>
                  )}
                </div>
              </div>

              <ChatBubble
                avatar={artist.emoji}
                name={artist.name}
                isArtist
                color={p}
                time="30m ago"
                text="Thanks for voting everyone! We're looking at dates — will announce the winner city in 48 hours 🙌"
              />
            </div>

            {/* Input bar */}
            <div className="bg-[#121212] p-4 flex items-center gap-3">
              <div className="flex-1 bg-[#282828] rounded-full px-4 py-2.5 text-[#B3B3B3] text-sm">
                Message {artist.name}…
              </div>
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-black text-sm font-bold" style={{ backgroundColor: p }}>
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatBubble({
  avatar, name, isArtist, color, time, text,
}: {
  avatar: string; name: string; isArtist: boolean; color: string; time: string; text: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: isArtist ? `${color}33` : "#282828" }}
      >
        {avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-xs font-bold">{name}</span>
          {isArtist && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold text-black"
              style={{ backgroundColor: color }}
            >
              ARTIST
            </span>
          )}
          <span className="text-[#B3B3B3] text-[10px]">{time}</span>
        </div>
        <div
          className="inline-block px-3 py-2 rounded-2xl text-white text-sm max-w-xs"
          style={{ background: isArtist ? `${color}22` : "#282828" }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ BOTTOM PLAYER ═══════════════ */
function BottomPlayer({
  artist, isPlaying, setIsPlaying, progressSec,
}: {
  artist: (typeof ARTISTS)[0] | null;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  progressSec: number;
}) {
  const p = artist?.theme.primary ?? "#1DB954";
  const trackName = artist?.latestTrack ?? "Liked Songs";

  return (
    <footer className="h-20 bg-[#181818] border-t border-white/10 flex items-center px-4 gap-4 shrink-0">
      {/* Track info */}
      <div className="flex items-center gap-3 w-48 min-w-0 shrink-0">
        <div
          className="w-11 h-11 rounded flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${p}33` }}
        >
          {artist?.emoji ?? "♪"}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{trackName}</p>
          <p className="text-[#B3B3B3] text-[11px] truncate">{artist?.name ?? "Spotify"}</p>
        </div>
        <button className="text-[#B3B3B3] hover:text-white text-sm ml-1 shrink-0">♡</button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-4">
          <button className="text-[#B3B3B3] hover:text-white text-base hidden sm:block">⇄</button>
          <button className="text-[#B3B3B3] hover:text-white text-lg">⏮</button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-black text-sm font-bold transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: p }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="text-[#B3B3B3] hover:text-white text-lg">⏭</button>
          <button className="text-[#B3B3B3] hover:text-white text-base hidden sm:block">↻</button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-sm">
          <span className="text-[#B3B3B3] text-[10px] w-8 text-right">{formatTime(progressSec)}</span>
          <div className="flex-1 h-1 bg-white/20 rounded-full">
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${(progressSec / 183) * 100}%`, backgroundColor: p }}
            />
          </div>
          <span className="text-[#B3B3B3] text-[10px] w-8">3:03</span>
        </div>
      </div>

      {/* Volume + Superfan badge */}
      <div className="flex items-center gap-3 w-48 justify-end shrink-0">
        {artist && (
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full text-black hidden sm:block"
            style={{ backgroundColor: p }}
          >
            Superfan #18
          </span>
        )}
        <span className="text-[#B3B3B3] text-sm hidden sm:block">🔊</span>
        <div className="w-20 h-1 bg-white/20 rounded-full hidden sm:block">
          <div className="w-3/4 h-1 bg-white/60 rounded-full" />
        </div>
      </div>
    </footer>
  );
}

/* ─── Helpers ─── */
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function SpotifyIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
