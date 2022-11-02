import React from "react";
import { IUserEvent } from "../../../store/store";
import "./EventLabel.css";

interface IEventLabelProps {
  variant: "week" | "month";
  event: IUserEvent;
  onShowEvent?: (id: number) => void;
}

export function EventLabel({
  event,
  variant = "week",
  onShowEvent: onEventShow,
}: IEventLabelProps) {
  return (
    <div
      className={`EventLabel ${variant}`}
      onClick={() => onEventShow?.call(null, event.id)}
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
