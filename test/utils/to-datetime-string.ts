export function toDateTimeString(date: Date): string {
  return date.toISOString().split('.')[0];
}
