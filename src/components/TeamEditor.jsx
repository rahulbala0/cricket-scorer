export default function TeamEditor({ label, teamName, setTeamName, players, setPlayer, addPlayer }) {
  return (
    <div style={{ marginBottom: "1.25rem", padding: "1rem", border: "0.5px solid var(--border)", borderRadius: "12px" }}>
      <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
        {label} name
      </label>
      <input
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        style={{ width: "100%", marginBottom: "0.75rem" }}
      />
      <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
        Players
      </label>
      {players.map((p, idx) => (
        <input
          key={idx}
          value={p}
          placeholder={`Player ${idx + 1}`}
          onChange={(e) => setPlayer(idx, e.target.value)}
          style={{ width: "100%", marginBottom: "0.4rem" }}
        />
      ))}
      <button onClick={addPlayer} style={{ fontSize: 13, padding: "4px 10px" }}>
        + Add player
      </button>
    </div>
  );
}
