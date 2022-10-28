import { useStore } from "effector-react";
import React from "react";
import { $eventsList, IUserEvent } from "../../../store/store";
import { range } from "../../../utils/range";
import { EventLabel } from "../../EventsList/EventLabel/EventLabel";
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
  const wCount = weekCount(year, month);
  return (
    <div className="MonthTable">
      {range(wCount).map((_, i) => (
        <div key={i} className="MonthWeek">
          {computeWeekdays(year, month, i).map((date) => (
            <MonthTableCell
              key={`${year}/${month}/${date}`}
              d={date}
              isToday={isSameDate(today, date)}
              isCurrentMonth={isSameMonth(d, date)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MonthTableCell({
  d,
  isToday,
  isCurrentMonth,
}: {
  d: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}) {
  const events = useStore($eventsList);
  const date = d.getDate();
  return (
    <div
      className={`MonthTableCell ${isToday ? "today" : ""} ${
        isCurrentMonth ? "current_month" : ""
      }`}
    >
      <div>
        <span className="MonthTableCell__date_span">{date}</span>
      </div>
      <div className="MonthTableCell__event_labels">
        <EventsLabels
          events={events}
          year={d.getFullYear()}
          month={d.getMonth()}
          date={date}
          limit={2}
        />
      </div>
    </div>
  );
}

function EventsLabels({
  year,
  month,
  date,
  events,
  limit = -1,
}: {
  year: number;
  month: number;
  date: number;
  events: IUserEvent[];
  limit?: number;
}) {
  const evList = events.map(
    (ev) => [new Date(ev.date), ev] as [Date, IUserEvent]
  );
  return (
    <>
      {evList
        .filter(
          ([d], i) =>
            d.getFullYear() === year &&
            d.getMonth() === month &&
            d.getDate() === date &&
            (limit > -1 ? i < limit : true)
        )
        .map(([_, ev]) => (
          <EventLabel variant="month" key={ev.id} event={ev} />
        ))}
    </>
  );
}

function weekCount(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  return Math.ceil((first + last) / 7);
}

function computeWeekdays(year: number, month: number, week: number): Date[] {
  const date = new Date(year, month, 1);
  date.setDate(date.getDate() - (date.getDay() - 1));
  date.setDate(date.getDate() + week * 7);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function isSameDate(d: Date, date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth();
  return (
    d.getFullYear() === year &&
    d.getMonth() === month &&
    d.getDate() === date.getDate()
  );
}

function isSameMonth(d: Date, date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth();
  return d.getFullYear() === year && d.getMonth() === month;
}
