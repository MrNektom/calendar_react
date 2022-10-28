import React from "react";
import { range } from "../../../utils/range";
import { weekdays } from "../Calendar";
import "./MonthLayout.css";

export function MonthLayout({ date }: { date: Date }) {
  return (
    <div className="MonthLayout">
      <WeekRow />
      <MonthTable date={date} />
    </div>
  );
}
function WeekRow() {
  return (
    <div className="WeekRow">
      {weekdays.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
}

function MonthTable({ date: d }: { date: Date }) {
  const today = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  return (
    <div className="MonthTable">
      {range(weekCount(year, month)).map((_, i) => (
        <div key={i} className="MonthWeek">
          {computeWeekdays(year, month, i).map((date) => (
            <MonthTableCell
              key={`${year}/${month}/${date}`}
              date={date}
              isToday={isSameDate(today, year, month, date)}
              isCurrentMonth={isSameMonth(d, year, month, i, date)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MonthTableCell({
  date,
  isToday,
  isCurrentMonth,
}: {
  date: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}) {
  return (
    <div
      className={`MonthTableCell ${isToday ? "today" : ""} ${
        isCurrentMonth ? "current_month" : ""
      }`}
    >
      <span className="MonthTableCell__date_span">{date}</span>
    </div>
  );
}

function weekCount(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  return Math.ceil((first + last) / 7);
}

function computeWeekdays(year: number, month: number, week: number): number[] {
  const date = new Date(year, month, 1);
  date.setDate(date.getDate() - (date.getDay() - 1));
  date.setDate(date.getDate() + week * 7);
  const days: number[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(d.getDate() + i);
    days.push(d.getDate());
  }
  return days;
}

function isSameDate(
  d: Date,
  year: number,
  month: number,
  date: number
): boolean {
  return (
    d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
  );
}

function isSameMonth(
  d: Date,
  year: number,
  month: number,
  monthWeek: number,
  date: number
): boolean {
  const wCount = weekCount(year, month);
  const lastDate = computeLastDate(year, month);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month &&
    ((monthWeek === 0 && date < 8) ||
      (monthWeek === wCount - 1 && date > lastDate - 7) ||
      (monthWeek > 0 && monthWeek < wCount - 1))
  );
}

function computeLastDate(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
