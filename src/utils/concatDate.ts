interface IConcatObj {
  year?: number;
  month?: number;
  date?: number;
}

export function concatDate(date: Date, concat: IConcatObj): Date {
  const d = new Date(date);

  if (typeof concat.year === "number") {
    d.setFullYear(concat.year);
  }
  if (typeof concat.month === "number") {
    d.setMonth(concat.month);
  }
  if (typeof concat.date === "number") {
    d.setDate(concat.date);
  }

  return d;
}
