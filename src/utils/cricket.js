export function legalBalls(balls) {
  return balls.filter((b) => b.extraType !== "wide" && b.extraType !== "noball");
}

export function oversString(balls) {
  const legal = legalBalls(balls).length;
  const completedOvers = Math.floor(legal / 6);
  const ballsThisOver = legal % 6;
  return `${completedOvers}.${ballsThisOver}`;
}

export function inningsScore(innings) {
  let runs = 0;
  let wickets = 0;
  for (const b of innings.balls) {
    runs += b.runs + (b.extraRuns || 0);
    if (b.isWicket) wickets += 1;
  }
  return { runs, wickets };
}

export function isInningsOver(innings, oversLimit, battingTeamSize) {
  const legal = legalBalls(innings.balls).length;
  if (legal >= oversLimit * 6) return true;
  const { wickets } = inningsScore(innings);
  if (wickets >= battingTeamSize - 1) return true;
  return false;
}
