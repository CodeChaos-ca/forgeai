export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function pluralize(count: number, singular: string, plural: string = singular + 's'): string {
  return count === 1 ? singular : plural;
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (!local || !domain) return email;
  
  const maskedLocal = local.length > 2 
    ? `${local.slice(0, 2)}${'*'.repeat(Math.max(1, local.length - 2))}`
    : '*'.repeat(local.length);
    
  return `${maskedLocal}@${domain}`;
}
