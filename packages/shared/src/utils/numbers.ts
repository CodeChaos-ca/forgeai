export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatPercentage(value: number, minimumFractionDigits: number = 0, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits }).format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
