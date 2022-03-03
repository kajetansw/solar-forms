export function getRandomDate(
  start: Date = new Date(Date.now()),
  end = getDateTimePlusDays(new Date(Date.now()))
) {
  return convertToUTC(convertToDate(getRandomDateTime(start, end)));
}

export function getRandomDateTime(
  start: Date = new Date(Date.now()),
  end = getDateTimePlusDays(new Date(Date.now()))
) {
  return convertToUTC(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
}

export function getRandomTimeString(): string {
  const pad = (number: number) => (number < 10 ? '0' : '') + number.toString();
  const r = Math.floor(Math.random() * 1440);
  const hh = pad(1 + (Math.floor(r / 60) % 12));
  const mm = pad(r % 60);

  return hh + ':' + mm;
}

function convertToDate(dateTime: Date): Date {
  return new Date(dateTime.toDateString());
}

/**
 * Converts date to UTC format. Used to avoid unwanted hour offset due to local timezone.
 * @param date
 */
function convertToUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

export function getDatePlusDays(start: Date, days = 365): Date {
  const randomDateTime = getDateTimePlusDays(start, days);
  return convertToUTC(convertToDate(randomDateTime));
}

export function getDateTimePlusDays(start: Date, days = 365): Date {
  const dayInMills = 1000 * 60 * 60 * 24 * days;
  return convertToUTC(new Date(+start + dayInMills));
}
