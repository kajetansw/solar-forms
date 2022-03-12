/**
 * Converts date object to string in the "yyyy-MM-ddTHH:mm:ss.sss+hh:mm" format.
 */
export function toISODateTimeLocal(d: Date): string {
  const z = (n: number) => ('0' + n).slice(-2);
  const zz = (n: number) => ('00' + n).slice(-3);
  let off = d.getTimezoneOffset();
  const sign = off > 0 ? '-' : '+';
  off = Math.abs(off);

  return (
    d.getFullYear() +
    '-' +
    z(d.getMonth() + 1) +
    '-' +
    z(d.getDate()) +
    'T' +
    z(d.getHours()) +
    ':' +
    z(d.getMinutes()) +
    ':' +
    z(d.getSeconds()) +
    '.' +
    zz(d.getMilliseconds()) +
    sign +
    z((off / 60) | 0) +
    ':' +
    z(off % 60)
  );
}

/**
 * Converts date object to string in the "yyyy-MM-dd" format.
 */
export function toISODate(date: Date): string {
  return toISODateTimeLocal(date).split('T')[0];
}

/**
 * Converts date object to string in the "yyyy-MM-ddTHH:mm:ss" format.
 */
export function toISODateTime(date: Date): string {
  return date.toISOString().split('.')[0];
}
