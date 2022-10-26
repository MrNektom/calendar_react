import React from "react";
import { range } from "../../../utils/range";
import { weekdays } from "../Calendar";
import "./WeekLayout.css";

export function WeekLayout({ date }: { date: Date }) {
  const now = new Date();
  const [days, today] = computeWeekdays(date);
  return (
    <div className="WeekLayout">
      <div className="WeekLayout__header">
        {range(weekdays.length + 1).map((i) => (
          <WeekLayoutHeaderCell
            key={i == 0 ? "GMT" : weekdays[i - 1]}
            x={i}
            day={days[i - 1]}
            isToday={i - 1 === today && i > 0}
          />
        ))}
      </div>
      <div className="WeekLayout__content">
        {range(24).map((y) => (
          <div className="row" key={String(y)}>
            {range(weekdays.length + 1).map((x) => (
              <div
                className={`cell ${x === 0 ? "time_cell" : ""}`}
                key={String(x)}
              >
                {x - 1 === today && x > 0 && now.getHours() == y && (
                  <HoursIndicator minuts={now.getMinutes()} />
                )}
                {x === 0 ? y : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekLayoutHeaderCell({
  x,
  day,
  isToday,
}: {
  x: number;
  day: number;
  isToday: boolean;
}) {
  return (
    <div
      className={`WeekLayout__header__cell ${(isToday && "today") || ""} ${
        (x === 0 && "timezone_cell") || ""
      }`.trim()}
    >
      {x === 0 ? (
        <>
          <span className="timezome">{getTimeZone()}</span>
        </>
      ) : (
        <>
          <span className="date">{day}</span>
          <span className="weekday">{weekdays[x - 1]}</span>
        </>
      )}
    </div>
  );
}

function HoursIndicator({ minuts }: { minuts: number }) {
  return (
    <div
      className="HoursIndicator"
      style={{ top: `${(minuts / 60) * 100}%` }}
    ></div>
  );
}

function getTimeZone() {
  const offset = new Date().getTimezoneOffset() / 60;
  return offset === 0 ? "UTC" : offset < 0 ? `GMT+${-offset}` : `GMT-${offset}`;
}

function computeWeekdays(date: Date): [number[], number] {
  const days: number[] = [];
  const n_date = new Date(date.getTime());
  n_date.setDate(date.getDate() - date.getDay());

  for (let i = 0; i < 7; i++) {
    n_date.setDate(n_date.getDate() + 1);
    days.push(n_date.getDate());
  }

  let today = -1;
  const now = new Date();
  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    today = date.getDay() - 1;
  }
  return [days, today];
}
