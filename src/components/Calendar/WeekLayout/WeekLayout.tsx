import { useStore } from "effector-react";
import React from "react";
import { match } from "ts-pattern";
import { $eventsList, IUserEvent } from "../../../store/store";
import { classes } from "../../../utils/classes";
import { range } from "../../../utils/range";
import { EventLabel } from "../../EventsList/EventLabel/EventLabel";
import { weekdays } from "../Calendar";
import "./WeekLayout.css";

interface IWeekLayoutProps {
  date: Date;
  onShowEvent?: (id: number) => void;
}

export function WeekLayout({ date, onShowEvent }: IWeekLayoutProps) {
  const eventsList = useStore($eventsList);
  const now = new Date();
  const [days, today] = computeWeekdays(date);
  console.log("today", today);

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

                {x > 0 && (
                  <EventsLabels
                    year={date.getFullYear()}
                    month={date.getMonth()}
                    date={days[x - 1]}
                    events={eventsList}
                    hours={y}
                    onShowEvent={onShowEvent}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsLabels({
  year,
  month,
  date,
  hours,
  events,
  onShowEvent,
}: {
  year: number;
  month: number;
  date: number;
  hours: number;
  events: IUserEvent[];
  onShowEvent?: (id: number) => void;
}) {
  const evList = events.map(
    (ev) => [new Date(ev.date), ev] as [Date, IUserEvent]
  );
  return (
    <>
      {evList
        .filter(
          ([d]) =>
            d.getFullYear() === year &&
            d.getMonth() === month &&
            d.getDate() === date &&
            d.getHours() === hours
        )
        .map(([_, ev]) => (
          <EventLabel
            variant="week"
            key={ev.id}
            event={ev}
            onShowEvent={onShowEvent}
          />
        ))}
    </>
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
      className={classes({
        WeekLayout__header__cell: true,
        today: isToday,
        timezone_cell: x === 0,
      })}
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
  const day = date.getDay() == 0 ? 7 : date.getDay();
  const days: number[] = [];
  const n_date = new Date(date.getTime());
  n_date.setDate(date.getDate() - day);

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
    today = now.getDay() - 1;
    if (today === -1) {
      today = 6;
    }
  }
  return [days, today];
}
