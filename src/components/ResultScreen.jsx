import ScorecardBlock from "./ScorecardBlock.jsx";
import { inningsScore } from "../utils/cricket.js";

export default function ResultScreen({ match, onGoHome }) {
  const [s1, s2] = match.innings.map(inningsScore);
  const [team0, team1] = match.innings.map((inn) => match.teams[inn.battingTeamIndex]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <button onClick={onGoHome} style={{ fontSize: 13, marginBottom: "1rem" }}>
        ← Home
      </button>
      <h1 style={{ marginBottom: "0.25rem" }}>Match complete</h1>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.5rem" }}>{match.result?.summary}</p>

      <ScorecardBlock teamName={team0.name} score={s1} oversLimit={match.oversLimit} balls={match.innings[0].balls} />
      <ScorecardBlock teamName={team1.name} score={s2} oversLimit={match.oversLimit} balls={match.innings[1].balls} />
    </div>
  );
}
