"use client";
import { useState } from "react";
import type { Theme } from "@/lib/types";
import { THEMES } from "@/lib/types";
import Onboarding from "@/components/Onboarding";

interface Props {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onGoHome: () => void;
}

type WorkspaceTab = "Music" | "Podcasts" | "Video Shows" | "Superfan Management";

export default function CreatorView({ theme, setTheme, onGoHome }: Props) {
  const [workspace, setWorkspace] = useState<WorkspaceTab>("Superfan Management");
  /* Auto-trigger the B2B guide tour on first entry; user can re-trigger via header button */
  const [showTour, setShowTour] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#121212] overflow-hidden">
      {/* ── B2B Creator Guide Tour (auto-launches on first entry) ── */}
      {showTour && (
        <Onboarding isCreatorMode={true} onComplete={() => setShowTour(false)} />
      )}

      {/* ── Top Bar ── */}
      <header className="bg-black border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <button onClick={onGoHome} className="text-[#B3B3B3] hover:text-white text-sm transition-colors whitespace-nowrap">
          ← Exit Hub to Role Selection
        </button>
        <div className="flex items-center gap-2">
          <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
          <span className="text-white font-bold">Spotify for Artists</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* ❓ Run Guide Tour — manually re-trigger B2B onboarding */}
          <button
            onClick={() => setShowTour(true)}
            className="text-[#B3B3B3] hover:text-white text-xs transition-colors whitespace-nowrap hidden sm:block"
          >
            ❓ Run Guide Tour
          </button>
          <div className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-sm">🎤</div>
          <span className="text-white text-sm font-semibold hidden sm:block">My Artist Profile</span>
        </div>
      </header>

      {/* ── Workspace Tabs (Step 6) ── */}
      <div className="bg-[#181818] border-b border-white/10 px-6 flex gap-0 overflow-x-auto shrink-0">
        {(["Music", "Podcasts", "Video Shows", "Superfan Management"] as WorkspaceTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setWorkspace(tab)}
            className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              workspace === tab
                ? "border-[#1DB954] text-[#1DB954]"
                : "border-transparent text-[#B3B3B3] hover:text-white"
            }`}
          >
            {tab}
            {tab === "Superfan Management" && (
              <span className="ml-2 bg-[#1DB954] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                ACTIVE
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        {workspace !== "Superfan Management" ? (
          <div className="flex items-center justify-center h-64 text-[#B3B3B3]">
            <p className="text-center">
              <span className="text-4xl block mb-3">🎵</span>
              {workspace} management coming soon.<br />
              Switch to <strong className="text-white">Superfan Management</strong> to continue.
            </p>
          </div>
        ) : (
          <SuperfanDashboard theme={theme} setTheme={setTheme} />
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SUPERFAN DASHBOARD (Steps 6–10)
════════════════════════════════════════ */
function SuperfanDashboard({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const p = theme.primary;

  /* Revenue calculator state */
  const [fanCount, setFanCount] = useState(500);
  const gross = fanCount * 4.99;
  const fee = gross * 0.2;
  const net = gross - fee;

  /* Canva variant selection */
  const [selectedVariant, setSelectedVariant] = useState<null | 1 | 2>(null);
  const [canvaBanner, setCanvaBanner] = useState(false);

  /* Toggle states (Step 10) */
  const [presaleActive, setPresaleActive] = useState(false);
  const [promoCodesActive, setPromoCodesActive] = useState(false);
  const [ibanLinked, setIbanLinked] = useState(false);
  const [stripeLinked, setStripeLinked] = useState(false);

  /* Invite system (Step 9) */
  const [invitesLeft, setInvitesLeft] = useState(3);
  const [inviteToast, setInviteToast] = useState(false);

  /* Promo overlay (Step 9) */
  const [promoOverlay, setPromoOverlay] = useState(false);

  /* A/B test active variant */
  const [abVariant, setAbVariant] = useState<"A" | "B" | null>(null);

  const handleGenerateInvite = () => {
    if (invitesLeft === 0) return;
    setInvitesLeft((n) => n - 1);
    setInviteToast(true);
    setTimeout(() => setInviteToast(false), 3500);
  };

  const handleSelectVariant = (v: 1 | 2) => {
    setSelectedVariant(v);
    if (v === 2) {
      setCanvaBanner(true);
      setTimeout(() => setCanvaBanner(false), 4000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fade-in">

      {/* ─── ELIGIBILITY GATE (Step 6) ─── */}
      <div className="bg-[#1A2A1A] border border-[#1DB954]/40 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-[#1DB954]/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">✓</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm mb-1">
            🔒 Superfan features unlock only if the artist has reached a minimum of 1,000 quarterly active streams from unique listeners.
          </p>
          <p className="text-[#B3B3B3] text-xs mb-2">Your current status:</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#1DB954]" style={{ width: "84%" }} />
            </div>
            <span className="text-[#1DB954] text-xs font-bold">8,400 / 1,000 streams ✓ Verified</span>
          </div>
        </div>
      </div>

      {/* ─── REVENUE CALCULATOR + AI INSIGHTS (Step 6) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Calculator */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-1">📊 Revenue Calculator</h2>
          <p className="text-[#B3B3B3] text-xs mb-5">Base tier: $4.99/mo per superfan</p>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#B3B3B3] text-sm">Superfans</span>
              <span className="text-white font-bold">{fanCount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={fanCount}
              onChange={(e) => setFanCount(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: p }}
            />
            <div className="flex justify-between text-[#B3B3B3] text-xs mt-1">
              <span>50</span>
              <span>10,000</span>
            </div>
          </div>

          <div className="space-y-3">
            <RevenueRow label="Total Gross Revenue" value={`$${gross.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} color="white" />
            <RevenueRow label="Spotify Platform Fee (20%)" value={`− $${fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} color="#ef4444" />
            <div className="border-t border-white/10 pt-3">
              <RevenueRow label="Your Net MRR" value={`$${net.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} color={p} large />
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">🤖 AI Actionable Insights</h2>
          <div className="space-y-3">
            {[
              {
                icon: "🎯",
                title: "How to reach your goal",
                body: "Your audience currently listens to Demo tracks during commutes. Start by publishing a hidden draft track or launch an exclusive poll.",
              },
              {
                icon: "📈",
                title: "Growth Opportunity",
                body: `At ${fanCount.toLocaleString()} fans you earn $${net.toFixed(2)}/mo. Reaching ${Math.round(fanCount * 1.5).toLocaleString()} fans adds $${(net * 0.5).toFixed(2)}/mo. Your fastest path: launch a city tour poll this week.`,
              },
              {
                icon: "⏰",
                title: "Best Time to Post",
                body: "Your core listeners (Women 18-24) are most active between 9–11 PM. Schedule your next exclusive drop tonight.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-[#282828] rounded-xl p-3 flex gap-3">
                <span className="text-xl flex-shrink-0">{card.icon}</span>
                <div>
                  <p className="text-white font-semibold text-xs mb-1">{card.title}</p>
                  <p className="text-[#B3B3B3] text-xs leading-relaxed">{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HEATMAP + DEMOGRAPHICS (Step 7) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Heatmap */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-1">🗺️ Premium Density Heatmap</h2>
          <p className="text-[#B3B3B3] text-xs mb-4">Spotify Premium core density by market</p>
          <div className="overflow-x-auto">
          <div className="space-y-4 min-w-[240px]">
            {[
              { city: "Paris", flag: "🇫🇷", pct: 45, color: "#E040FB" },
              { city: "New York", flag: "🇺🇸", pct: 40, color: "#1DB954" },
              { city: "Kyiv", flag: "🇺🇦", pct: 35, color: "#FF5722" },
            ].map((row) => (
              <div key={row.city}>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-white text-sm font-medium whitespace-nowrap">{row.flag} {row.city}</span>
                  <span className="text-white font-bold text-sm whitespace-nowrap">{row.pct}% Premium Core Density</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">👥 Demographic Core Insights</h2>
          <div className="space-y-3">
            <div className="bg-[#282828] rounded-xl p-4">
              <p className="text-[#B3B3B3] text-xs mb-2 font-semibold uppercase tracking-wide">Age & Gender</p>
              <div className="space-y-2">
                <DemoBar label="Women 18–24" pct={54} color="#E040FB" />
                <DemoBar label="Men 25–34" pct={30} color="#1DB954" />
                <DemoBar label="Other / 35+" pct={16} color="#B3B3B3" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#282828] rounded-xl p-3">
                <p className="text-[#B3B3B3] text-xs mb-2">Top Cities</p>
                {["Kyiv", "Berlin", "London"].map((c) => (
                  <p key={c} className="text-white text-xs font-semibold">• {c}</p>
                ))}
              </div>
              <div className="bg-[#282828] rounded-xl p-3">
                <p className="text-[#B3B3B3] text-xs mb-2">Top Countries</p>
                {["Ukraine 🇺🇦", "Germany 🇩🇪", "UK 🇬🇧"].map((c) => (
                  <p key={c} className="text-white text-xs font-semibold">• {c}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── VIRAL LOOPS + SMART PRICING (Step 7) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Viral Loops */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">🔁 Viral Loops Conversion</h2>
          <div className="overflow-x-auto">
            <div className="space-y-4 min-w-[220px]">
              <StatMetric icon="📤" label="Social Sharing Rate" value="84%" sub="of your superfans published their personal badge to Stories" color={p} />
              <StatMetric icon="👁️" label="Organic Reach Gained" value="+45,000" sub="unique listeners via fan story shares" color="#E040FB" />
              <StatMetric icon="🔄" label="Referral Conversion" value="12.3%" sub="of story viewers clicked through to your profile" color="#FF5722" />
            </div>
          </div>
        </div>

        {/* Smart Pricing */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">💰 Dynamic Smart Pricing</h2>
          <div className="bg-[#282828] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold" style={{ color: p }}>$4.99</span>
              <div>
                <p className="text-white font-bold text-sm">Recommended Price</p>
                <p className="text-[#B3B3B3] text-xs">AI-validated optimal tier</p>
              </div>
            </div>
            <p className="text-[#B3B3B3] text-xs leading-relaxed">
              Validation: 65% of your monetizable listeners are concentrated in regions where the average Meta/Spotify premium standard checkout sits at this optimal tier. Minimum subscription price starts at <strong className="text-white">$4.99/mo</strong> per Spotify platform policy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {[{ label: "$4.99", note: "Optimal ✓" }, { label: "$9.99", note: "Premium tier" }, { label: "$14.99", note: "Max Profit" }].map((opt) => (
              <div
                key={opt.label}
                className={`flex-1 rounded-xl p-3 text-center border transition-all ${
                  opt.note.includes("✓") ? "border-current" : "border-white/10"
                }`}
                style={opt.note.includes("✓") ? { borderColor: p, background: `${p}15` } : {}}
              >
                <p className="text-white font-bold text-sm">{opt.label}</p>
                <p className="text-[#B3B3B3] text-[10px]">{opt.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── AI STRATEGY CARD + A/B TESTING (Step 7) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AI Strategy */}
        <div className="bg-[#181818] rounded-2xl p-5 border" style={{ borderColor: `${p}44` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2 py-1 rounded-full text-black" style={{ backgroundColor: p }}>
              AI STRATEGY
            </span>
            <span className="text-[#B3B3B3] text-xs">Personalized Playbook</span>
          </div>
          <div className="space-y-3 mb-4">
            <p className="text-white text-sm leading-relaxed">
              Your demographic core (Women 18-24) listens to your tracks <strong>late at night on headphones</strong>.
            </p>
            <div className="bg-[#282828] rounded-xl p-3">
              <p className="text-xs font-bold mb-1" style={{ color: p }}>Action 1:</p>
              <p className="text-white text-xs">Drop an exclusive acoustic demo file tonight at <strong>9:00 PM</strong>. Projected reach: +3,200 stream initiations.</p>
            </div>
            <div className="bg-[#282828] rounded-xl p-3">
              <p className="text-xs font-bold mb-1" style={{ color: p }}>Action 2:</p>
              <p className="text-white text-xs">Your most loyal fans live in Ukraine. Launch an exclusive tour poll allowing them to crowdsource and vote for the live concert setlist.</p>
            </div>
          </div>

          {/* Survey card preview */}
          <button
            className="w-full border rounded-xl p-3 text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: `${p}55`, color: p }}
            onClick={() => alert("Survey template: 'Which song should open our Kyiv show? [Track 1] [Track 2] [Surprise me!]' — Ready to launch to your Ukrainian superfans.")}
          >
            👁️ Preview Tour Poll Survey Template
          </button>
        </div>

        {/* A/B Testing */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-4">🧪 Smart A/B Testing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { key: "A" as const, label: "Template A", ctr: "3.2%", desc: "Standard album art background, green CTA", preview: "🟩" },
              { key: "B" as const, label: "Template B", ctr: "11.7%", desc: "Artist selfie background, bold typography CTA", preview: "🌟" },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setAbVariant(v.key)}
                className={`rounded-xl p-4 border text-left transition-all hover:scale-[1.02] ${
                  abVariant === v.key ? "border-current" : "border-white/10 hover:border-white/30"
                }`}
                style={abVariant === v.key ? { borderColor: p, background: `${p}15` } : {}}
              >
                <div className="h-20 bg-[#282828] rounded-lg flex items-center justify-center text-3xl mb-3">
                  {v.preview}
                </div>
                <p className="text-white text-xs font-bold mb-1">{v.label}</p>
                <p className="text-[#B3B3B3] text-[10px] mb-2">{v.desc}</p>
                <p className="font-bold text-sm" style={{ color: v.key === "B" ? p : "#B3B3B3" }}>
                  CTR: {v.ctr}
                  {v.key === "B" && <span className="text-[10px] ml-1">▲ WINNER</span>}
                </p>
              </button>
            ))}
          </div>
          {abVariant && (
            <div
              className="text-center py-2 rounded-xl text-xs font-bold animate-fade-in"
              style={{ backgroundColor: `${p}20`, color: p }}
            >
              Template {abVariant} active · Simulated CTR spike: {abVariant === "B" ? "+265%" : "+12%"}
            </div>
          )}
        </div>
      </div>

      {/* ─── AI TASTE ANALYTICS + CANVA TEMPLATE (Step 8) ─── */}
      <div className="bg-[#181818] rounded-2xl p-5">
        <h2 className="text-white font-bold text-base mb-4">🎯 AI Fan Taste Analytics</h2>
        <div
          className="rounded-xl p-4 mb-5 border"
          style={{ background: `${p}10`, borderColor: `${p}33` }}
        >
          <p className="text-white text-sm leading-relaxed">
            <strong style={{ color: p }}>Taste Analytics:</strong> Your listeners are <strong>78% more interested</strong> in voting for vinyl options and priority tickets than listening to raw demo recordings. The standard Call-To-Action "Listen to my first demo" will yield <strong className="text-red-400">low conversions</strong>.
          </p>
        </div>

        <h3 className="text-white font-semibold text-sm mb-3">AI Template Selector — Select Optimal Strategy:</h3>

        {canvaBanner && (
          <div className="bg-green-900/40 border border-green-500/60 rounded-xl p-3 mb-4 flex items-center gap-2 animate-slide-up">
            <span className="text-green-400 text-lg">✓</span>
            <p className="text-green-300 font-semibold text-sm">Template activated and synchronized with Canva Integration.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              id: 1 as const,
              priority: "Low Priority",
              ctr: "2.1%",
              text: "Join now and listen to early track demos.",
              color: "#B3B3B3",
              bg: "#282828",
              badge: "❌ Low Conversion",
            },
            {
              id: 2 as const,
              priority: "AI RECOMMENDED",
              ctr: "14.8%",
              text: "Become my Superfan and decide which city I tour next and which poster design I launch!",
              color: p,
              bg: `${p}15`,
              badge: "✅ High Priority",
            },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelectVariant(v.id)}
              className={`rounded-2xl p-5 text-left border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                selectedVariant === v.id ? "ring-2" : ""
              }`}
              style={{
                background: v.bg,
                borderColor: selectedVariant === v.id ? v.color : "rgba(255,255,255,0.1)",
                "--tw-ring-color": v.color,
              } as React.CSSProperties}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ color: v.color, backgroundColor: `${v.color}20` }}
                >
                  {v.priority}
                </span>
                <span className="text-xs">{v.badge}</span>
              </div>
              <p className="text-white text-sm font-semibold mb-2">"{v.text}"</p>
              <p className="text-xs" style={{ color: v.color }}>
                AI Projected Conversion Rate: <strong>{v.ctr}</strong>
              </p>
              {selectedVariant === v.id && v.id === 2 && (
                <p className="text-green-400 text-xs mt-2 font-semibold animate-fade-in">
                  ✓ Selected & synced with Canva
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── THEME ENGINE + PROMO (Step 9) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Theme selector */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-2">🎨 Superfan Theme Engine</h2>
          <p className="text-[#B3B3B3] text-xs mb-4">Select your artist aesthetic accent color</p>
          <div className="flex gap-3 mb-4">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t)}
                title={t.name}
                className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 active:scale-95 ${
                  theme.key === t.key ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: t.primary }}
              />
            ))}
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: `${p}15`, border: `1px solid ${p}33` }}
          >
            <p className="text-white text-xs font-semibold mb-1">Active: {theme.name}</p>
            <p className="text-[#B3B3B3] text-xs">This color is applied across your Superfan Hub, priority comments, and fan badges.</p>
          </div>
        </div>

        {/* Promo generator */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <h2 className="text-white font-bold text-base mb-2">📱 Promo Content Generator</h2>
          <p className="text-[#B3B3B3] text-xs mb-4">Generate shareable Story templates for Instagram & TikTok</p>
          <button
            onClick={() => setPromoOverlay(true)}
            className="w-full py-3 rounded-xl font-bold text-black text-sm mb-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: p }}
          >
            Generate Promo Content
          </button>
          <div className="text-[#B3B3B3] text-xs space-y-1.5">
            {["Vertical 9:16 Story format", "Animated Spotify Canvas background", "Auto-branded with your artist colors"].map((f) => (
              <p key={f}>✓ {f}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ─── REFERRAL INVITES (Step 9) ─── */}
      <div className="bg-[#181818] rounded-2xl p-5">
        <h2 className="text-white font-bold text-base mb-4">✉️ Referral Invites</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3 bg-[#282828] rounded-xl px-4 py-3">
            <span className="text-2xl">✉️</span>
            <div>
              <p className="text-[#B3B3B3] text-xs">Available monthly invites</p>
              <p className="text-white font-bold">{invitesLeft} / 3 remaining</p>
            </div>
            <div className="flex gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-colors"
                  style={{ backgroundColor: i < invitesLeft ? p : "#282828", border: "1px solid #535353" }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerateInvite}
            disabled={invitesLeft === 0}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              invitesLeft > 0 ? "hover:scale-[1.02] active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
            }`}
            style={{ backgroundColor: invitesLeft > 0 ? p : "#535353", color: "#000" }}
          >
            [Generate Unique Invite Link]
          </button>
        </div>

        {/* Toast */}
        {inviteToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-toast">
            <div className="bg-[#282828] border border-white/20 rounded-2xl px-5 py-3 shadow-2xl max-w-sm text-center">
              <p className="text-[#1DB954] font-bold text-sm mb-1">✓ Unique invite link copied!</p>
              <p className="text-[#B3B3B3] text-xs">Send it to a fellow artist to grant them priority free access to the Superfan Hub ecosystem.</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── COMMERCE MODULES (Step 10) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Concert Tickets */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎟️</span>
            <h2 className="text-white font-bold text-base">Concert Tickets</h2>
            <span className="text-[#B3B3B3] text-xs">Ticketmaster / Dice</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#282828] rounded-xl p-4">
              <div>
                <p className="text-white text-sm font-semibold">Activate 48-Hour Superfan Presale</p>
                <p className="text-[#B3B3B3] text-xs">Superfans get 2-day early ticket access</p>
              </div>
              <Toggle active={presaleActive} onToggle={() => setPresaleActive(!presaleActive)} color={p} />
            </div>
            <label className="flex items-start gap-3 bg-[#282828] rounded-xl p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={promoCodesActive}
                onChange={() => setPromoCodesActive(!promoCodesActive)}
                className="mt-0.5 accent-[#1DB954]"
              />
              <div>
                <p className="text-white text-sm font-semibold">Auto-generate promo codes</p>
                <p className="text-[#B3B3B3] text-xs">Generate unique, single-use promo codes automatically dispatched via email</p>
              </div>
            </label>
          </div>
        </div>

        {/* Merchandise */}
        <div className="bg-[#181818] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👕</span>
            <h2 className="text-white font-bold text-base">Merchandise</h2>
            <span className="text-[#B3B3B3] text-xs">Shopify Gate</span>
          </div>
          <div className="space-y-4">
            <button
              className="w-full py-3 rounded-xl border font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: `${p}55`, color: p }}
              onClick={() => alert("Shopify connection wizard — Create your exclusive Superfan merch drop with automated subscriber gating.")}
            >
              [Create Superfan Exclusive Merch]
            </button>
            <div className="bg-[#282828] rounded-xl p-4">
              <p className="text-white text-sm font-semibold mb-1">Automated Subscriber Discounts</p>
              <p className="text-[#B3B3B3] text-xs">
                Configure permanent 20% automated subscriber discounts linked to registered emails
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: p }}>20%</span>
                <span className="text-[#B3B3B3] text-xs">auto-applied at checkout for active superfans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PAYOUTS (Step 10) ─── */}
      <div className="bg-[#181818] rounded-2xl p-5">
        <h2 className="text-white font-bold text-base mb-4">💳 Payout & Financial Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setIbanLinked(!ibanLinked)}
            className={`flex items-center gap-3 rounded-xl p-4 border text-left transition-all hover:scale-[1.02] ${
              ibanLinked ? "border-[#1DB954]" : "border-white/10"
            }`}
            style={ibanLinked ? { background: "#1DB95415" } : {}}
          >
            <span className="text-2xl">🏦</span>
            <div>
              <p className="text-white text-sm font-semibold">
                {ibanLinked ? "✓ IBAN Linked" : "[Link IBAN / Business Registration Account]"}
              </p>
              <p className="text-[#B3B3B3] text-xs">Bank transfer payouts</p>
            </div>
          </button>
          <button
            onClick={() => setStripeLinked(!stripeLinked)}
            className={`flex items-center gap-3 rounded-xl p-4 border text-left transition-all hover:scale-[1.02] ${
              stripeLinked ? "border-[#1DB954]" : "border-white/10"
            }`}
            style={stripeLinked ? { background: "#1DB95415" } : {}}
          >
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-white text-sm font-semibold">
                {stripeLinked ? "✓ Stripe / PayPal Linked" : "[Connect Stripe / PayPal]"}
              </p>
              <p className="text-[#B3B3B3] text-xs">Instant digital payouts</p>
            </div>
          </button>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{ background: "#1DB95415", borderColor: "#1DB95440" }}
        >
          <p className="text-[#1DB954] text-xs font-semibold uppercase tracking-wide mb-2">Active Payout Status</p>
          <p className="text-white font-bold text-base">
            Next Payout: Coming Tuesday. Available for withdrawal:{" "}
            <span className="text-[#1DB954]">$420.00</span>
          </p>
          <p className="text-[#B3B3B3] text-xs mt-1">
            Minimum $10 payout threshold cleared. ✓
          </p>
        </div>
      </div>

      {/* ─── ANTI-FRAUD VAULT (Step 10) ─── */}
      <div className="bg-[#181818] rounded-2xl p-5 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🛡️</span>
          <h2 className="text-white font-bold text-base">Anti-Fraud & Content Vault Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { icon: "🛡️", label: "Shield Status", value: "Active", color: "#1DB954" },
            { icon: "🚫", label: "No-Refund Policy Enforcement", value: "Enabled", color: "#1DB954" },
            { icon: "🔐", label: "Media Stream Encryption", value: "Enabled", color: "#1DB954" },
          ].map((item) => (
            <div key={item.label} className="bg-[#282828] rounded-xl p-3 text-center">
              <span className="text-2xl block mb-1">{item.icon}</span>
              <p className="text-[#B3B3B3] text-[10px] mb-1">{item.label}</p>
              <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#0A0A0A] rounded-xl p-4">
          <p className="text-[#B3B3B3] text-xs leading-relaxed mb-2">
            <strong className="text-white">Screen-recording and rip protection initialized.</strong> Media stream encryption is active across all Superfan-exclusive content.
          </p>
          <p className="text-[#B3B3B3] text-xs leading-relaxed">
            <strong className="text-white">Platform Legal:</strong> Users canceling mid-month retain access until the next billing cycle. Current month refunds are blocked at the architecture level to protect creators from fraudulent chargebacks.
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-6" />

      {/* ─── PROMO OVERLAY (Step 9) ─── */}
      {promoOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-xs animate-pop-in">
            {/* Story card */}
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: `linear-gradient(160deg, ${p}44 0%, #000 50%, ${p}22 100%)`,
                border: `1px solid ${p}55`,
                aspectRatio: "9/16",
                maxHeight: "520px",
              }}
            >
              {/* Animated canvas bg */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, ${p}88 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${theme.accent}66 0%, transparent 50%)`,
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                <SpotifyIcon className="w-10 h-10 text-[#1DB954] mb-4" />
                <p className="text-white font-bold text-xl leading-tight mb-4">
                  Become my Spotify Superfan and unlock early access now!
                </p>
                <div
                  className="px-5 py-3 rounded-full font-bold text-black text-sm mb-4"
                  style={{ backgroundColor: p }}
                >
                  Join Now →
                </div>
                <p className="text-white/60 text-xs">spotify.com/superfan</p>
              </div>
            </div>
            <button
              onClick={() => setPromoOverlay(false)}
              className="w-full mt-4 py-3 rounded-full bg-[#282828] hover:bg-[#383838] text-white font-bold text-sm transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */
function RevenueRow({
  label, value, color, large,
}: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#B3B3B3] text-sm">{label}</span>
      <span className={`font-bold ${large ? "text-xl" : "text-sm"}`} style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function DemoBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#B3B3B3]">{label}</span>
        <span className="text-white font-bold">{pct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function StatMetric({
  icon, label, value, sub, color,
}: { icon: string; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex items-start gap-3 bg-[#282828] rounded-xl p-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-[#B3B3B3] text-xs">{label}</p>
        <p className="font-bold text-lg" style={{ color }}>{value}</p>
        <p className="text-[#B3B3B3] text-xs leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

function Toggle({ active, onToggle, color }: { active: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0`}
      style={{ backgroundColor: active ? color : "#535353" }}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300`}
        style={{ left: active ? "28px" : "4px" }}
      />
    </button>
  );
}

function SpotifyIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
