import { oversString } from "../utils/cricket.js";

export default function ScorecardBlock({ teamName, score, oversLimit, balls }) {
  return (
    <div style={{ marginBottom: "1rem", padding: "1rem", border: "0.5px solid var(--border)", borderRadius: 12 }}>
      <div style={{ fontWeight: 500 }}>{teamName}</div>
      <div style={{ fontSize: 20 }}>
        {score.runs}/{score.wickets}{" "}
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>({oversString(balls)} ov)</span>
      </div>
    </div>
  );
}
