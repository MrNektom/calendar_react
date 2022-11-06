export function weekCount(year: number, month: number): number {
  const first = new Date(year, month, 1);
  const firstDay = first.getDay() == 0 ? 7 : first.getDay();
  const last = new Date(year, month + 1, 0).getDate();
  return Math.ceil((firstDay + last) / 7);
}
