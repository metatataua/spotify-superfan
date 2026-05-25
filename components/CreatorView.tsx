'use client';
import React, { useState } from 'react';

export default function CreatorView() {
  const [activeTab, setActiveTab] = useState('superfans');
  const [fanCount, setFanCount] = useState(1000);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState('green');
  const [invitesLeft, setInvitesLeft] = useState(3);
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [ticketPresale, setTicketPresale] = useState(false);

  // Math logic based on strictly minimum $4.99 tier minus 20% Spotify fee
  const pricePerFan = 4.99;
  const grossMRR = fanCount * pricePerFan;
  const spotifyFee = grossMRR * 0.20;
  const netMRR = grossMRR - spotifyFee;

  const handleGenerateInvite = () => {
    if (invitesLeft > 0) {
      setInvitesLeft(prev => prev - 1);
      setShowInviteToast(true);
      setTimeout(() => setShowInviteToast(false), 3000);
    }
  };

  // Dynamic theme engine mapping
  const themeClasses: Record<string, string> = {
    green: 'text-[#1DB954] bg-[#1DB954] border-[#1DB954]',
    purple: 'text-[#a855f7] bg-[#a855f7] border-[#a855f7]',
    cyan: 'text-[#06b6d4] bg-[#06b6d4] border-[#06b6d4]'
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white p-4 md:p-8 font-sans pb-24">
      {/* Toast Notification */}
      {showInviteToast && (
        <div className="fixed bottom-6 right-6 bg-[#1DB954] text-black px-6 py-3 rounded-full font-bold text-sm shadow-2xl z-50 animate-bounce">
          🚀 Unique invite link copied to clipboard!
        </div>
      )}

      {/* Eligibility Gate Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-600/20 to-amber-900/40 border border-amber-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-amber-400 flex items-center gap-2">🔒 Superfan Verification Status: ACTIVE</h4>
          <p className="text-xs text-gray-300 mt-1">You reached 1,245 unique streams this quarter (Minimum required threshold: 1,000 active streams).</p>
        </div>
        <div className="w-full sm:w-1/3 bg-gray-800 h-2.5 rounded-full overflow-hidden">
          <div className="bg-amber-400 h-full w-full rounded-full"></div>
        </div>
      </div>

      {/* Header & Workspace Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Superfan Hub <span className="text-xs uppercase px-2 py-0.5 bg-gray-800 text-gray-400 rounded ml-2">B2B Admin</span></h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Manage monetization loops, dynamic demographics, and interactive media vaults.</p>
        </div>
        
        {/* Workspace Switcher Tabs */}
        <div className="flex bg-[#1a1a1a] p-1 rounded-full text-xs md:text-sm overflow-x-auto whitespace-nowrap self-start lg:self-auto">
          {['music', 'podcasts', 'video', 'superfans'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-[#282828] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'superfans' ? '📊 Superfan Management' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN ANALYTICS GRID — 1 column on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Revenue Calculator & AI Advice */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calculator Card */}
          <div className="bg-[#181818] p-6 rounded-xl border border-gray-800">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📈 Interactive Net MRR Calculator</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Target Superfan Count:</span>
                <span className="font-mono text-xl font-bold text-[#1DB954]">{fanCount.toLocaleString()} fans</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="10000" 
                step="50"
                value={fanCount}
                onChange={(e) => setFanCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
              />
              
              {/* Financial Breakdown Columns (Responsive Stack) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800 text-center sm:text-left">
                <div className="p-3 bg-[#282828] rounded-lg">
                  <div className="text-xs text-gray-400">Gross Monthly Revenue</div>
                  <div className="text-lg font-bold text-gray-300">${grossMRR.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500">Based on $4.99/mo tier</div>
                </div>
                <div className="p-3 bg-[#282828] rounded-lg">
                  <div className="text-xs text-gray-400">Spotify Platform Fee (20%)</div>
                  <div className="text-lg font-bold text-red-400">-${spotifyFee.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500">Infrastructure & Processing</div>
                </div>
                <div className="p-3 bg-[#282828] rounded-lg border border-[#1DB954]/30">
                  <div className="text-xs text-gray-400">Your Net Earnings (MRR)</div>
                  <div className="text-xl font-extrabold text-[#1DB954]">${netMRR.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-400">Direct monthly payout</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Taste Analytics & Canva Templates */}
          <div className="bg-[#181818] p-6 rounded-xl border border-gray-800">
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-lg mb-6">
              <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">🤖 AI Fan Taste Analytics</h4>
              <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                Taste Analytics: Your listeners are <strong className="text-white">78% more interested</strong> in voting for vinyl options and priority tickets than listening to raw demo recordings. The standard Call-To-Action "Listen to my first demo" will yield low conversions.
              </p>
            </div>

            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select AI-Optimized Marketing Campaign</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Variant 1 */}
              <div className="p-4 bg-[#282828] border border-gray-800 rounded-lg opacity-60">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Low Priority</span>
                  <span className="text-xs font-mono font-bold text-gray-400">CTR: 2.1%</span>
                </div>
                <p className="text-sm text-gray-300">"Join now and listen to early track demos."</p>
              </div>

              {/* Variant 2 */}
              <div 
                onClick={() => setSelectedTemplate(2)}
                className={`p-4 bg-[#282828] rounded-lg cursor-pointer transition-all border ${
                  selectedTemplate === 2 ? 'border-[#1DB954] shadow-lg shadow-[#1DB954]/10' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">✨ AI Recommended</span>
                  <span className="text-xs font-mono font-bold text-[#1DB954]">CTR: 14.8%</span>
                </div>
                <p className="text-sm font-medium text-white">"Become my Superfan and decide which city I tour next and which poster design I launch!"</p>
                
                {selectedTemplate === 2 && (
                  <div className="mt-3 pt-2 border-t border-gray-700 text-[11px] text-[#1DB954] font-bold flex items-center gap-1 animate-pulse">
                    ✅ Template activated and synchronized with Canva Integration.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Premium Heatmaps & Demographics (Responsive Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heatmap */}
            <div className="bg-[#181818] p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">📍 Premium Core Density Heatmap</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between p-2 bg-[#282828] rounded"><span>1. Paris</span> <span className="font-bold text-[#1DB954]">45% Premium Users</span></div>
                <div className="flex justify-between p-2 bg-[#282828] rounded"><span>2. New York</span> <span className="font-bold text-[#1DB954]">40% Premium Users</span></div>
                <div className="flex justify-between p-2 bg-[#282828] rounded"><span>3. Kyiv</span> <span className="font-bold text-[#1DB954]">35% Premium Users</span></div>
              </div>
            </div>

            {/* Demographics */}
