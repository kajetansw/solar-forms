// TODO only for testing purposes, may be removed when redundant
export default function getRandomTeam(): 'engineering' | 'product' | 'testing' {
  const validTeams = ['engineering', 'product', 'testing'] as const;
  return validTeams[Math.floor(Math.random() * 3)];
}
