export function classes(classList: Record<string, boolean>): string {
  return Object.entries(classList)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(" ");
}
