import { useEvent } from "effector-react";
import React from "react";
import { IUserEvent } from "../../../store/store";
import { eventShows } from "../EventsList";
import "./EventLabel.css";

export function EventLabel({ event }: { event: IUserEvent }) {
  const showEvent = useEvent(eventShows);
  return (
    <div className="EventLabel" onClick={() => showEvent(event.id)}>
      <div className="EventLabel__tooltip">
        <div className="EventLabel__tooltip__title">{event.title}</div>
        <div className="EventLabel__tooltip__description">
          {event.description}
        </div>
      </div>
    </div>
  );
}
