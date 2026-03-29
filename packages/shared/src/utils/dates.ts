export function formatDate(date: Date | string | number, formatStyle: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', { dateStyle: formatStyle }).format(d);
}

export function formatRelativeTime(date: Date | string | number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const time = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const now = Date.now();
  const elapsed = time - now;

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const absElapsed = Math.abs(elapsed);

  if (absElapsed < msPerMinute) {
    return rtf.format(Math.round(elapsed / 1000), 'second');
  } else if (absElapsed < msPerHour) {
    return rtf.format(Math.round(elapsed / msPerMinute), 'minute');
  } else if (absElapsed < msPerDay) {
    return rtf.format(Math.round(elapsed / msPerHour), 'hour');
  } else if (absElapsed < msPerMonth) {
    return rtf.format(Math.round(elapsed / msPerDay), 'day');
  } else if (absElapsed < msPerYear) {
    return rtf.format(Math.round(elapsed / msPerMonth), 'month');
  } else {
    return rtf.format(Math.round(elapsed / msPerYear), 'year');
  }
}

export function convertTimezone(date: Date | string | number, timeZone: string): Date {
  const d = date instanceof Date ? date : new Date(date);
  const tzDateStr = d.toLocaleString('en-US', { timeZone });
  return new Date(tzDateStr);
}

export function isExpired(expirationDate: Date | string | number): boolean {
  const time = expirationDate instanceof Date ? expirationDate.getTime() : new Date(expirationDate).getTime();
  return time < Date.now();
}
