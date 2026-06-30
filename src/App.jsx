import { useState, useEffect, useCallback } from "react";
import HomeScreen from "./components/HomeScreen.jsx";
import SetupScreen from "./components/SetupScreen.jsx";
import ScoringScreen from "./components/ScoringScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { createMatch, createInnings } from "./data/models.js";
import { loadMatches, saveMatches } from "./storage/storage.js";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    setMatches(loadMatches());
  }, []);

  const persist = useCallback((next) => {
    setMatches(next);
    saveMatches(next);
  }, []);

  const updateMatch = useCallback(
    (matchId, updater) => {
      const next = matches.map((m) => (m.id === matchId ? updater(m) : m));
      persist(next);
    },
    [matches, persist]
  );

  const activeMatch = matches.find((m) => m.id === activeMatchId) || null;

  if (view === "home") {
    return (
      <HomeScreen
        matches={matches}
        onNewMatch={() => setView("setup")}
        onOpenMatch={(id) => {
          setActiveMatchId(id);
          const m = matches.find((x) => x.id === id);
          setView(m.status === "complete" ? "result" : "scoring");
        }}
      />
    );
  }

  if (view === "setup") {
    return (
      <SetupScreen
        onCancel={() => setView("home")}
        onCreate={(teamA, teamB, oversLimit, battingFirstIndex) => {
          const match = createMatch(teamA, teamB, oversLimit);
          match.battingFirstIndex = battingFirstIndex;
          match.innings = [createInnings(battingFirstIndex)];
          match.status = "innings1";
          const next = [...matches, match];
          persist(next);
          setActiveMatchId(match.id);
          setView("scoring");
        }}
      />
    );
  }

  if (view === "scoring" && activeMatch) {
    return (
      <ScoringScreen
        match={activeMatch}
        onUpdate={(updater) => updateMatch(activeMatch.id, updater)}
        onGoHome={() => setView("home")}
        onFinished={() => setView("result")}
      />
    );
  }

  if (view === "result" && activeMatch) {
    return <ResultScreen match={activeMatch} onGoHome={() => setView("home")} />;
  }

  setView("home");
  return null;
}
