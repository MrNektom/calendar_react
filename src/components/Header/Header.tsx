import { useEvent } from "effector-react";
import { match } from "ts-pattern";
import React from "react";
import {
  layoutTypeChanged,
  nextPeriod,
  prevPeriod,
  TLayoutType,
} from "../../store/store";
import { IconButton } from "../IconButton/IconButton";
import { PeriodLabel } from "../PeriodLabel/PeriodLabel";
import { Select } from "../Select/Select";
import "./Header.css";
export function Header() {
  const goToNextPeriod = useEvent(nextPeriod);
  const goToPrevPeriod = useEvent(prevPeriod);
  const changeLayout = useEvent(layoutTypeChanged);
  function selectLayoutType(i: number) {
    changeLayout(
      match<0 | 1 | 2, TLayoutType>(i as 0 | 1 | 2)
        .with(0, () => "week")
        .with(1, () => "month")
        .with(2, () => "year")
        .exhaustive()
    );
  }

  return (
    <div className="Header">
      <span className="Header__title">Calendar</span>
      <button>Today</button>
      <IconButton icon="chevron_left" onClick={() => goToPrevPeriod()} />
      <PeriodLabel />
      <IconButton icon="chevron_right" onClick={() => goToNextPeriod()} />
      <div style={{ flex: "1" }}></div>
      <Select onSelected={selectLayoutType}>
        <span>Week</span>
        <span>Month</span>
        <span>Year</span>
      </Select>
    </div>
  );
}
