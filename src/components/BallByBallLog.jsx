export default function BallByBallLog({ balls, battingTeam, bowlingTeam }) {
  if (!balls.length) return null;

  const findName = (teamPlayers, id) => teamPlayers.find((p) => p.id === id)?.name || "?";
  const recent = [...balls].slice(-12).reverse();

  return (
    <div>
      <h2 style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Recent balls</h2>
      <div style={{ fontSize: 13 }}>
        {recent.map((b) => (
          <div key={b.id} style={{ padding: "4px 0", borderBottom: "0.5px solid var(--border)" }}>
            {findName(bowlingTeam.players, b.bowlerId)} to {findName(battingTeam.players, b.strikerId)}:{" "}
            {b.isWicket
              ? `OUT (${b.wicketType})`
              : b.extraType
              ? `${b.extraType} ${b.extraRuns}`
              : `${b.runs} run${b.runs === 1 ? "" : "s"}`}
          </div>
        ))}
      </div>
    </div>
  );
}
