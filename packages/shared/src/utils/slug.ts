export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateSlug(text: string, withEntropy: boolean = true): string {
  const baseSlug = slugify(text);
  if (!withEntropy) {
    return baseSlug || Math.random().toString(36).substring(2, 10);
  }
  const entropy = Math.random().toString(36).substring(2, 8);
  if (!baseSlug) {
    return entropy;
  }
  return `${baseSlug}-${entropy}`;
}
