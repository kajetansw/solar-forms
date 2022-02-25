export function getRandomDate(
  start: Date = new Date(Date.now()),
  end = getDateTimePlusDays(new Date(Date.now()))
) {
  return convertToDate(getRandomDateTime(start, end));
}

export function getRandomDateTime(
  start: Date = new Date(Date.now()),
  end = getDateTimePlusDays(new Date(Date.now()))
) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function convertToDate(dateTime: Date): Date {
  return new Date(dateTime.toDateString());
}

export function getDatePlusDays(start: Date, days = 365): Date {
  const randomDateTime = getDateTimePlusDays(start, days);
  return convertToDate(randomDateTime);
}

export function getDateTimePlusDays(start: Date, days = 365): Date {
  const dayInMills = 1000 * 60 * 60 * 24 * days;
  return new Date(+start + dayInMills);
}
