export default function MatchListItem({ match, onOpen }) {
  const [teamA, teamB] = match.teams;
  const summary =
    match.status === "complete"
      ? match.result?.summary || "Completed"
      : `In progress · ${match.status === "innings1" ? "1st innings" : "2nd innings"}`;

  return (
    <button
      onClick={onOpen}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "0.75rem 1rem",
        marginBottom: "0.5rem",
        borderRadius: "var(--radius)",
        border: "0.5px solid var(--border)",
      }}
    >
      <div style={{ fontWeight: 500 }}>
        {teamA.name} vs {teamB.name}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{summary}</div>
    </button>
  );
}
