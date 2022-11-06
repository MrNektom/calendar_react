import "./Calendar.css";
import React, { useRef, useState } from "react";
import { useStore } from "effector-react";
import { match } from "ts-pattern";
import { $layoutType, $targetDate } from "../../store/store";
import { MonthLayout } from "./MonthLayout/MonthLayout";
import { WeekLayout } from "./WeekLayout/WeekLayout";
import { YearLayout } from "./YearLayout/YearLayout";

interface ICalendarProps {
  onShowEvent?: (id: number) => void;
}

export function Calendar({ onShowEvent }: ICalendarProps) {
  const { scrolled, ref } = useScrolled();
  const layoutType = useStore($layoutType);
  const targetDate = useStore($targetDate);

  return (
    <div className={`Calendar ${scrolled ? "scrolled" : ""}`} ref={ref}>
      {match(layoutType)
        .with("week", () => (
          <WeekLayout date={targetDate} onShowEvent={onShowEvent} />
        ))
        .with("month", () => (
          <MonthLayout date={targetDate} onShowEvent={onShowEvent} />
        ))
        .with("year", () => <YearLayout onShowEvent={onShowEvent} />)
        .exhaustive()}
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
