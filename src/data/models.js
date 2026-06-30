export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createTeam(name, playerNames) {
  return {
    name,
    players: playerNames.map((n) => ({ id: newId(), name: n })),
  };
}

export function createInnings(battingTeamIndex) {
  return {
    battingTeamIndex,
    balls: [],
    strikerIdx: 0,
    nonStrikerIdx: 1,
    currentBowlerId: null,
    battingOrder: [],
    outBatterIds: [],
  };
}

export function createMatch(teamA, teamB, oversLimit) {
  return {
    id: newId(),
    createdAt: Date.now(),
    teams: [teamA, teamB],
    oversLimit,
    status: "setup",
    battingFirstIndex: 0,
    innings: [],
    result: null,
  };
}
