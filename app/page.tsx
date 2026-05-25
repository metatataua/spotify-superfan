"use client";
import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import RoleSelection from "@/components/RoleSelection";
import FanView from "@/components/FanView";
import CreatorView from "@/components/CreatorView";
import type { AppState, PollVotes, Theme } from "@/lib/types";
import { THEMES } from "@/lib/types";

export default function Home() {
  const [appState, setAppState]               = useState<AppState>("onboarding");
  const [theme, setTheme]                     = useState<Theme>(THEMES[0]);
  const [selectedArtistId, setSelectedArtistId] = useState<number>(1);
  const [pollVotes, setPollVotes]             = useState<PollVotes>({ Kyiv: 423, Lviv: 287, London: 341 });
  const [userVote, setUserVote]               = useState<string | null>(null);
  const [isPlaying, setIsPlaying]             = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {appState === "onboarding" && (
        <Onboarding onComplete={() => setAppState("role_selection")} />
      )}

      {appState === "role_selection" && (
        <RoleSelection
          onSelectFan={() => setAppState("fan_unsubscribed")}
          onSelectCreator={() => setAppState("creator_hub")}
        />
      )}

      {(appState === "fan_unsubscribed" || appState === "fan_subscribed") && (
        <FanView
          appState={appState}
          theme={theme}
          selectedArtistId={selectedArtistId}
          setSelectedArtistId={setSelectedArtistId}
          onSubscribe={() => setAppState("fan_subscribed")}
          pollVotes={pollVotes}
          setPollVotes={setPollVotes}
          userVote={userVote}
          setUserVote={setUserVote}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onGoHome={() => setAppState("role_selection")}
        />
      )}

      {appState === "creator_hub" && (
        <CreatorView
          theme={theme}
          setTheme={setTheme}
          onGoHome={() => setAppState("role_selection")}
        />
      )}
    </div>
  );
}
