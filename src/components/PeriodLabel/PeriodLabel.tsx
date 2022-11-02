import { useStore } from "effector-react";
import React from "react";
import { match } from "ts-pattern";
import { $layoutType, $targetDate } from "../../store/store";

export function PeriodLabel() {
  const layoutType = useStore($layoutType);
  const date = useStore($targetDate);

  const label = match(layoutType)
    .with("week", () => computeWeekLabel(date))
    .with("month", () =>
      date.toLocaleString(["en"], { month: "long", year: "numeric" })
    )
    .with("year", () => date.toLocaleString(["en"], { year: "numeric" }))
    .exhaustive();
  return <span>{label}</span>;
}

function computeWeekLabel(date: Date): string {
  const startWeek = new Date(date);
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());
  const endWeek = new Date(date);
  endWeek.setDate(endWeek.getDate() + (7 - endWeek.getDay()));

  return startWeek.getFullYear() === endWeek.getFullYear() ? `` : ``;
}
