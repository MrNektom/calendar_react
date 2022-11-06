import { useStore } from "effector-react";
import React, { RefObject, useRef, useState } from "react";
import { $eventsList, IUserEvent } from "../../../store/store";
import { classes } from "../../../utils/classes";
import { range } from "../../../utils/range";
import { EventLabel } from "../../EventsList/EventLabel/EventLabel";
import { Map } from "../../Map";
import { Popup } from "../../Popup/Popup";
import { Show } from "../../Show";
import { weekdays } from "../Calendar";
import "./MonthLayout.css";
import { weekCount } from "../../../utils/weekCount";

export function MonthLayout({
  date,
  onShowEvent,
}: {
  date: Date;
  onShowEvent?(id: number): void;
}) {
  return (
    <div className="MonthLayout">
      <WeekRow />
      <MonthTable date={date} onShowEvent={onShowEvent} />
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

function MonthTable({
  date,
  onShowEvent,
}: {
  date: Date;
  onShowEvent?(id: number): void;
}) {
  const events = useStore($eventsList);
  const today = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const wCount = weekCount(year, month);
  const [eventsDateShowed, setEventsDateShowed] = useState<Date | null>(null);
  const showAnchor = useRef<HTMLDivElement | null>(null);

  function showEvents(d: Date, ref: RefObject<HTMLDivElement | null>) {
    setEventsDateShowed(d);
    showAnchor.current = ref.current;
  }

  function handleShowEvent(id: number) {
    onShowEvent?.call(null, id);
    setEventsDateShowed(null);
    showAnchor.current = null;
  }

  function handleHide() {
    setEventsDateShowed(null);
    showAnchor.current = null;
  }

  return (
    <div className="MonthTable">
      <Map arr={range(wCount)} k={(i) => i}>
        {(i) => (
          <div className="MonthWeek">
            <Map arr={computeWeekdays(year, month, i)} k={(d) => d.toString()}>
              {(d) => (
                <MonthTableCell
                  key={`${year}/${month}/${d}`}
                  d={d}
                  isToday={isSameDate(today, d)}
                  isCurrentMonth={isSameMonth(date, d)}
                  events={events}
                  onShowEvents={showEvents}
                />
              )}
            </Map>
          </div>
        )}
      </Map>

      <Popup
        show={eventsDateShowed !== null}
        onHide={handleHide}
        anchor={showAnchor}
      >
        <div className="MonthTable__EventLabelPopup">
          <Map k={(e) => e.id} arr={eventsInDate(events, eventsDateShowed)}>
            {(ev) => (
              <EventLabel
                event={ev}
                variant="month"
                onShowEvent={handleShowEvent}
              ></EventLabel>
            )}
          </Map>
        </div>
      </Popup>
    </div>
  );
}

function MonthTableCell({
  d,
  isToday,
  isCurrentMonth,
  events,
  onShowEvents,
}: {
  d: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: IUserEvent[];
  onShowEvents: (date: Date, ref: RefObject<HTMLDivElement | null>) => void;
}) {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const date = d.getDate();

  return (
    <div
      className={classes({
        MonthTableCell: true,
        today: isToday,
        current_month: isCurrentMonth,
      })}
      ref={cellRef}
    >
      <div>
        <span className="MonthTableCell__date_span">{date}</span>
      </div>
      <div className="MonthTableCell__event_labels">
        <Show cond={hasEvents(events, d)}>
          <div
            className="event_indicator_wrapper"
            onClick={() => onShowEvents(d, cellRef)}
          >
            <div className="event_indicator"></div>
          </div>
        </Show>
      </div>
    </div>
  );
}

function hasEvents(events: IUserEvent[], date: Date): boolean {
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (isSameDate(date, new Date(event.date))) {
      return true;
    }
  }
  return false;
}

export function eventsInDate(
  events: IUserEvent[],
  d: Date | null
): IUserEvent[] {
  if (!d) {
    return events;
  }
  return events.filter((e) => isSameDate(d, new Date(e.date)));
}

function computeWeekdays(year: number, month: number, week: number): Date[] {
  const date = new Date(year, month, 1);
  const day = date.getDay() == 0 ? 6 : date.getDay() - 1;
  date.setDate(date.getDate() - day);
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
