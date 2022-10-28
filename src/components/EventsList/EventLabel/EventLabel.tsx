import { useEvent } from "effector-react";
import React from "react";
import { IUserEvent } from "../../../store/store";
import { eventShows } from "../EventsList";
import "./EventLabel.css";

interface IEventLabelProps {
  variant: "week" | "month";
  event: IUserEvent;
}

export function EventLabel({ event, variant = "week" }: IEventLabelProps) {
  const showEvent = useEvent(eventShows);
  return (
    <div
      className={`EventLabel ${variant}`}
      onClick={() => showEvent(event.id)}
    >
      <div className="EventLabel__tooltip">
        <div className="EventLabel__tooltip__title">{event.title}</div>
        {variant == "week" && (
          <div className="EventLabel__tooltip__description">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
}
