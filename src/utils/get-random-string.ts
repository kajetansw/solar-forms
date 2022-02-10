// TODO only for testing purposes, may be removed when redundant
export default function getRandomString(): string {
  return (Math.random() + 1).toString(36).substring(7);
}
