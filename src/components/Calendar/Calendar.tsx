import { useStore } from "effector-react";
import React, { useRef, useState } from "react";
import { match } from "ts-pattern";
import { $layoutType, $targetDate } from "../../store/store";
import { range } from "../../utils/range";
import "./Calendar.css";
import { WeekLayout } from "./WeekLayout/WeekLayout";

export function Calendar() {
  const { scrolled, ref } = useScrolled();
  const layoutType = useStore($layoutType);
  const targetDate = useStore($targetDate);

  return (
    <div className={`Calendar ${scrolled ? "scrolled" : ""}`} ref={ref}>
      {match(layoutType)
        .with("week", () => <WeekLayout date={targetDate} />)
        .with("month", () => <CalendarMonthLayout />)
        .with("year", () => <CalendarYearLayout />)
        .exhaustive()}
    </div>
  );
}

function CalendarMonthLayout() {
  return (
    <>
      <WeekRow />
    </>
  );
}
function CalendarYearLayout() {
  return <></>;
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

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  const [elem, setElem] = useState<HTMLElement | null>(null);

  function handleScroll() {
    if (elem) {
      if (elem.scrollTop !== 0 && !scrolled) {
        setScrolled(true);
      } else if (elem.scrollTop === 0) {
        setScrolled(false);
      }
    }
  }
  const handlerRef = useRef<() => void>(handleScroll);

  elem?.removeEventListener("scroll", handlerRef.current);
  elem?.addEventListener("scroll", handleScroll);
  handlerRef.current = handleScroll;

  return {
    scrolled,
    ref(el: HTMLElement | null) {
      elem?.removeEventListener("scroll", handlerRef.current);
      setElem(el);
    },
  };
}

const firstday = new Intl.Locale(navigator.language).weekInfo?.firstDay || 1;

export const weekdays = (() => {
  const list = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(1970, 1, 1 + i + firstday).toLocaleDateString("en", {
      weekday: "short",
    });
    list.push(day);
  }
  return list;
})();

function weekCount(year: number, month: number): number {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  return Math.ceil((first + last) / 7);
}
