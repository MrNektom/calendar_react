import { createEvent, createStore } from "effector";
import { match } from "ts-pattern";

export interface IUserEvent {
  id: number;
  title: string;
  date: number;
  color: string;
  description: string;
}

export type TLayoutType = "week" | "month" | "year";

export const $layoutType = createStore<TLayoutType>("week");
export const $targetDate = createStore(new Date());
export const $eventsList = createStore<IUserEvent[]>(
  JSON.parse(localStorage.getItem("eventsList") || "[]")
);

export const layoutTypeChanged = createEvent<TLayoutType>();
export const nextPeriod = createEvent();
export const prevPeriod = createEvent();
export const eventAdded = createEvent<IUserEvent>();
export const eventRemoved = createEvent<number>();
export const eventEdited = createEvent<[number, IUserEvent]>();

export let last_id = 0;

$layoutType.on(layoutTypeChanged, (_, payload) => payload);

$targetDate.on(nextPeriod, (date) =>
  match<TLayoutType, Date>($layoutType.getState())
    .with("week", () => computeNextWeek(date))
    .with("month", () => computeNextMonth(date))
    .with("year", () => computeNextYear(date))
    .exhaustive()
);

function computeNextWeek(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() + 7);
  return newDate;
}
function computeNextMonth(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setMonth(date.getMonth() + 1);

  return newDate;
}
function computeNextYear(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setFullYear(date.getFullYear() + 1);

  return newDate;
}

$targetDate.on(prevPeriod, (date) =>
  match<TLayoutType, Date>($layoutType.getState())
    .with("week", () => computePrevWeek(date))
    .with("month", () => computePrevMonth(date))
    .with("year", () => computePrevYear(date))
    .exhaustive()
);

function computePrevWeek(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() - 7);
  return newDate;
}
function computePrevMonth(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setMonth(date.getMonth() - 1);

  return newDate;
}
function computePrevYear(date: Date): Date {
  const newDate = new Date(date.getTime());
  newDate.setFullYear(date.getFullYear() - 1);

  return newDate;
}

$eventsList.getState().forEach((e) => {
  if (last_id < e.id) {
    last_id = e.id;
  }
});

$eventsList.on(eventAdded, (state, event) => state.concat(event));
$eventsList.on(eventRemoved, (state, index) =>
  state.filter((_, i) => i !== index)
);
$eventsList.on(eventEdited, (state, [index, event]) =>
  state.map((ev, i) => (i === index ? event : ev))
);

$eventsList.subscribe((state) => {
  localStorage.setItem("eventsList", JSON.stringify(state));
});
