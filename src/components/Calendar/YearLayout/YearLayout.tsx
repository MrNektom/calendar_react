import React, { MouseEvent, useRef, useState } from "react";
import "./YearLayout.css";
import { range } from "../../../utils/range";
import { Map } from "../../Map";
import { useStore } from "effector-react";
import { $eventsList, $targetDate, IUserEvent } from "../../../store/store";
import { concatDate } from "../../../utils/concatDate";
import { classes } from "../../../utils/classes";
import { Popup } from "../../Popup/Popup";
import { EventLabel } from "../../EventsList/EventLabel/EventLabel";
import { eventsInDate } from "../MonthLayout/MonthLayout";

export function YearLayout({
  onShowEvent,
}: {
  onShowEvent?(id: number): void;
}): JSX.Element {
  const eventList = useStore($eventsList);
  const targetDate = useStore($targetDate);
  const [eventDateToShow, setEventDateToShow] = useState<Date | null>(null);

  function handleOpenEventList(date: Date) {
    setEventDateToShow(date);
  }

  function handleHide() {
    setEventDateToShow(null);
  }

  function handleShowEvent(id: number) {
    setEventDateToShow(null);
    onShowEvent?.call(null, id);
  }

  return (
    <div className="YearLayout">
      <Map arr={range(12)} k={(i) => i}>
        {(month) => (
          <YearMonth
            date={concatDate(targetDate, { month })}
            eventList={eventList}
            onOpenEventList={handleOpenEventList}
          />
        )}
      </Map>
      <Popup show={eventDateToShow !== null} onHide={handleHide}>
        <Map k={(e) => e.id} arr={eventsInDate(eventList, eventDateToShow)}>
          {(ev) => (
            <EventLabel
              event={ev}
              variant="month"
              onShowEvent={handleShowEvent}
            ></EventLabel>
          )}
        </Map>
      </Popup>
    </div>
  );
}

function YearMonth({
  date,
  eventList,
  onOpenEventList,
}: {
  date: Date;
  eventList: IUserEvent[];
  onOpenEventList(date: Date): void;
}): JSX.Element {
  const monthRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();

  function handleOpenEventList(e: MouseEvent<HTMLDivElement>, d: IDate) {
    e.currentTarget.classList.contains("has_events") &&
      onOpenEventList(new Date(d.year, d.month, d.date));
  }

  return (
    <div className="YearMonth" ref={monthRef}>
      <span className="month_name">{getMonthName(date)}</span>
      <div className="YearMonth__date_table">
        <Map
          arr={monthRange(date.getFullYear(), date.getMonth())}
          k={(d) => `${d.date}/${d.month}/${d.year}`}
        >
          {(d) => (
            <div
              className={classes({
                YearMonth__date_table__cell: true,
                other_month: d.month !== date.getMonth(),
                today: isSameDate(today, d.year, d.month, d.date),
                has_events: hasEvents(eventList, d.year, d.month, d.date),
              })}
              onClick={(e) => handleOpenEventList(e, d)}
            >
              <span className="date_span">{d.date}</span>
            </div>
          )}
        </Map>
      </div>
    </div>
  );
}

interface IDate {
  date: number;
  month: number;
  year: number;
}

function monthRange(year: number, month: number): IDate[] {
  const d = new Date(year, month, 1);
  const day = d.getDay() == 0 ? 7 : d.getDay();
  d.setDate(1 - day);
  return range(6 * 7).map(() => {
    d.setDate(d.getDate() + 1);
    return { date: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
  });
}

function getMonthName(date: Date): string {
  return date.toLocaleString(["en"], { month: "long" });
}

function hasEvents(
  eventList: IUserEvent[],
  year: number,
  month: number,
  date: number
): boolean {
  for (let i = 0; i < eventList.length; i++) {
    const event = eventList[i];
    const d = new Date(event.date);
    if (isSameDate(d, year, month, date)) {
      return true;
    }
  }
  return false;
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
