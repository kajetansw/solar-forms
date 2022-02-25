export default function getRandomString(): string {
  return (Math.random() + 1).toString(36).substring(7);
}
