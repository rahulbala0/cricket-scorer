import { useState, useEffect } from "react";
import BallInput from "./BallInput.jsx";
import BallByBallLog from "./BallByBallLog.jsx";
import { createInnings, newId } from "../data/models.js";
import { legalBalls, oversString, inningsScore, isInningsOver } from "../utils/cricket.js";

export default function ScoringScreen({ match, onUpdate, onGoHome, onFinished }) {
  const inningsIdx = match.status === "innings1" ? 0 : 1;
  const innings = match.innings[inningsIdx];
  const battingTeam = match.teams[innings.battingTeamIndex];
  const bowlingTeam = match.teams[1 - innings.battingTeamIndex];

  const battingOrder =
    innings.battingOrder.length > 0 ? innings.battingOrder : battingTeam.players.map((p) => p.id);

  const strikerId = battingOrder[innings.strikerIdx];
  const nonStrikerId = battingOrder[innings.nonStrikerIdx];
  const striker = battingTeam.players.find((p) => p.id === strikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === nonStrikerId);

  const { runs, wickets } = inningsScore(innings);
  const oversDisplay = oversString(innings.balls);
  const target = inningsIdx === 1 ? inningsScore(match.innings[0]).runs + 1 : null;

  const [bowlerId, setBowlerId] = useState(innings.currentBowlerId || bowlingTeam.players[0]?.id || "");
  const [nextBatterId, setNextBatterId] = useState("");

  const dismissedIds = new Set(innings.outBatterIds);
  const availableBatters = battingTeam.players.filter(
    (p) => !dismissedIds.has(p.id) && p.id !== strikerId && p.id !== nonStrikerId
  );

  const needsNewBatter = !innings.balls.length
    ? false
    : (() => {
        const last = innings.balls[innings.balls.length - 1];
        return last && last.isWicket && last.dismissedPlayerId === strikerId && dismissedIds.has(strikerId);
      })();

  function recordBall({ runs: r, extraType, extraRuns, isWicket, wicketType, dismissedPlayerId }) {
    const ball = {
      id: newId(),
      strikerId,
      nonStrikerId,
      bowlerId,
      runs: r,
      extraType: extraType || null,
      extraRuns: extraRuns || 0,
      isWicket: !!isWicket,
      wicketType: wicketType || null,
      dismissedPlayerId: dismissedPlayerId || null,
    };

    onUpdate((m) => {
      const idx = m.status === "innings1" ? 0 : 1;
      const inn = { ...m.innings[idx] };
      inn.balls = [...inn.balls, ball];
      inn.currentBowlerId = bowlerId;
      if (!inn.battingOrder.length) {
        inn.battingOrder = battingTeam.players.map((p) => p.id);
      }

      if (ball.isWicket) {
        inn.outBatterIds = [...inn.outBatterIds, ball.dismissedPlayerId];
      }

      const isLegal = extraType !== "wide" && extraType !== "noball";
      const runsForRotation = extraType === "bye" || extraType === "legbye" ? extraRuns : r;
      const shouldRotate = !ball.isWicket && runsForRotation % 2 === 1;

      if (shouldRotate) {
        const tmp = inn.strikerIdx;
        inn.strikerIdx = inn.nonStrikerIdx;
        inn.nonStrikerIdx = tmp;
      }

      const legalCount = legalBalls(inn.balls).length;
      if (isLegal && legalCount % 6 === 0 && legalCount > 0 && !ball.isWicket) {
        const tmp = inn.strikerIdx;
        inn.strikerIdx = inn.nonStrikerIdx;
        inn.nonStrikerIdx = tmp;
      }

      const newInnings = [...m.innings];
      newInnings[idx] = inn;

      const over_ = isInningsOver(inn, m.oversLimit, battingTeam.players.length);

      let newStatus = m.status;
      let newResult = m.result;

      if (over_) {
        if (idx === 0) {
          newStatus = "innings2";
          newInnings.push(createInnings(1 - inn.battingTeamIndex));
        } else {
          newStatus = "complete";
          const s1 = inningsScore(newInnings[0]);
          const s2 = inningsScore(newInnings[1]);
          const team0 = m.teams[newInnings[0].battingTeamIndex];
          const team1 = m.teams[newInnings[1].battingTeamIndex];
          if (s2.runs > s1.runs) {
            const wicketsLeft = team1.players.length - 1 - s2.wickets;
            newResult = {
              winnerIndex: newInnings[1].battingTeamIndex,
              summary: `${team1.name} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? "" : "s"}`,
            };
          } else if (s1.runs > s2.runs) {
            const runMargin = s1.runs - s2.runs;
            newResult = {
              winnerIndex: newInnings[0].battingTeamIndex,
              summary: `${team0.name} won by ${runMargin} run${runMargin === 1 ? "" : "s"}`,
            };
          } else {
            newResult = { winnerIndex: null, summary: "Match tied" };
          }
        }
      }

      return { ...m, innings: newInnings, status: newStatus, result: newResult };
    });
  }

  useEffect(() => {
    if (match.status === "complete") onFinished();
  }, [match.status]);

  function confirmNextBatter() {
    if (!nextBatterId) return;
    onUpdate((m) => {
      const idx = m.status === "innings1" ? 0 : 1;
      const inn = { ...m.innings[idx] };
      const order = [...inn.battingOrder];
      const slot = order[inn.strikerIdx] === strikerId ? inn.strikerIdx : inn.nonStrikerIdx;
      order[slot] = nextBatterId;
      inn.battingOrder = order;
      const newInnings = [...m.innings];
      newInnings[idx] = inn;
      return { ...m, innings: newInnings };
    });
    setNextBatterId("");
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.25rem 1rem" }}>
      <button onClick={onGoHome} style={{ fontSize: 13, marginBottom: "0.75rem" }}>
        ← Home
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {battingTeam.name} batting · {match.status === "innings1" ? "1st innings" : "2nd innings"}
        </div>
        <div style={{ fontSize: 28, fontWeight: 500 }}>
          {runs}/{wickets} <span style={{ fontSize: 16, color: "var(--text-secondary)" }}>({oversDisplay} ov)</span>
        </div>
        {target && (
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Target {target} · need {Math.max(target - runs, 0)} from {match.oversLimit * 6 - legalBalls(innings.balls).length} balls
          </div>
        )}
      </div>

      {needsNewBatter ? (
        <div style={{ marginBottom: "1rem", padding: "1rem", border: "0.5px solid var(--border)", borderRadius: 12 }}>
          <p style={{ marginTop: 0, fontWeight: 500 }}>Wicket! Select next batter</p>
          <select value={nextBatterId} onChange={(e) => setNextBatterId(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}>
            <option value="">Choose batter</option>
            {availableBatters.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button onClick={confirmNextBatter} disabled={!nextBatterId} style={{ width: "100%" }}>
            Confirm
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: 14 }}>
            <span>
              <strong>{striker?.name}*</strong>
            </span>
            <span style={{ color: "var(--text-secondary)" }}>{nonStriker?.name}</span>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
              Bowler
            </label>
            <select value={bowlerId} onChange={(e) => setBowlerId(e.target.value)} style={{ width: "100%" }}>
              {bowlingTeam.players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <BallInput
            onRuns={(r) => recordBall({ runs: r })}
            onExtra={(type, extraRuns) => recordBall({ runs: 0, extraType: type, extraRuns })}
            onWicket={(wicketType) => {
              const dismissed = wicketType === "run-out-non-striker" ? nonStrikerId : strikerId;
              recordBall({
                runs: 0,
                isWicket: true,
                wicketType: wicketType === "run-out-non-striker" ? "run out" : wicketType,
                dismissedPlayerId: dismissed,
              });
            }}
          />
        </>
      )}

      <BallByBallLog balls={innings.balls} battingTeam={battingTeam} bowlingTeam={bowlingTeam} />
    </div>
  );
}
