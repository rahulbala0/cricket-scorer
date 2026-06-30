import MatchListItem from "./MatchListItem.jsx";

export default function HomeScreen({ matches, onNewMatch, onOpenMatch }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Cricket scorer</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: "1.5rem" }}>
        Score your matches ball by ball.
      </p>
      <button onClick={onNewMatch} style={{ width: "100%", marginBottom: "1.5rem", fontWeight: 500 }}>
        + New match
      </button>

      {matches.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No matches yet. Start one above.</p>
      ) : (
        <div>
          <h2 style={{ color: "var(--text-secondary)" }}>Past & ongoing matches</h2>
          {[...matches].reverse().map((m) => (
            <MatchListItem key={m.id} match={m} onOpen={() => onOpenMatch(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
