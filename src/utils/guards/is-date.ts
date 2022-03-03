export function isDate(date: unknown): date is Date {
  return Object.prototype.toString.call(date) === '[object Date]';
}
