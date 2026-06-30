import { useState } from "react";
import TeamEditor from "./TeamEditor.jsx";
import { createTeam } from "../data/models.js";

export default function SetupScreen({ onCancel, onCreate }) {
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [playersA, setPlayersA] = useState(["", "", ""]);
  const [playersB, setPlayersB] = useState(["", "", ""]);
  const [overs, setOvers] = useState(20);
  const [battingFirst, setBattingFirst] = useState(0);
  const [error, setError] = useState("");

  const updatePlayer = (list, setList, idx, value) => {
    const next = [...list];
    next[idx] = value;
    setList(next);
  };

  const addPlayerSlot = (list, setList) => setList([...list, ""]);

  const handleCreate = () => {
    const cleanA = playersA.map((p) => p.trim()).filter(Boolean);
    const cleanB = playersB.map((p) => p.trim()).filter(Boolean);
    if (cleanA.length < 2 || cleanB.length < 2) {
      setError("Each team needs at least 2 players.");
      return;
    }
    if (!teamAName.trim() || !teamBName.trim()) {
      setError("Both teams need a name.");
      return;
    }
    if (!overs || overs < 1) {
      setError("Overs must be at least 1.");
      return;
    }
    setError("");
    onCreate(createTeam(teamAName.trim(), cleanA), createTeam(teamBName.trim(), cleanB), Number(overs), battingFirst);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>New match</h1>

      <TeamEditor
        label="Team A"
        teamName={teamAName}
        setTeamName={setTeamAName}
        players={playersA}
        setPlayer={(idx, v) => updatePlayer(playersA, setPlayersA, idx, v)}
        addPlayer={() => addPlayerSlot(playersA, setPlayersA)}
      />
      <TeamEditor
        label="Team B"
        teamName={teamBName}
        setTeamName={setTeamBName}
        players={playersB}
        setPlayer={(idx, v) => updatePlayer(playersB, setPlayersB, idx, v)}
        addPlayer={() => addPlayerSlot(playersB, setPlayersB)}
      />

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
          Overs per innings
        </label>
        <input type="number" min="1" value={overs} onChange={(e) => setOvers(e.target.value)} style={{ width: 100 }} />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
          Who bats first?
        </label>
        <select value={battingFirst} onChange={(e) => setBattingFirst(Number(e.target.value))}>
          <option value={0}>{teamAName || "Team A"}</option>
          <option value={1}>{teamBName || "Team B"}</option>
        </select>
      </div>

      {error && <p style={{ color: "var(--text-danger)", fontSize: 14 }}>{error}</p>}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </button>
        <button onClick={handleCreate} style={{ flex: 1, fontWeight: 500 }}>
          Start match
        </button>
      </div>
    </div>
  );
}
