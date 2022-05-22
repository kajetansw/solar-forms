export const TEAMS = ['engineering', 'product', 'testing'] as const;

export type Team = typeof TEAMS[number];

export default function getRandomTeam(): Team {
  return TEAMS[Math.floor(Math.random() * TEAMS.length)];
}
