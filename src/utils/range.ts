export function range(count: number): number[] {
  return new Array(count).fill(0).map((_, i) => i);
}
