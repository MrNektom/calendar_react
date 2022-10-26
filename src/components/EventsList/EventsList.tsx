import { createEvent, createStore } from "effector";
import { useEvent, useStore } from "effector-react";
import React, { useState } from "react";
import {
  $eventsList,
  eventAdded,
  eventRemoved,
  IUserEvent,
  last_id as lid,
} from "../../store/store";
import { Dialog } from "../Dialog/Dialog";
import { IconButton } from "../IconButton/IconButton";
import { TextArea } from "../TextArea/TextArea";
import { TextField } from "../TextField/TextField";
import "./EventsList.css";

let last_id = lid;

export function EventsList() {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const events = useStore($eventsList);
  const addEvent = useEvent(eventAdded);
  const removeEvent = useEvent(eventRemoved);

  function handleAddEvent() {
    setShowDialog(false);
    setTitle("");
    setDescription("");
    addEvent({
      id: ++last_id,
      title,
      date: Date.now(),
      description,
      color: `hsl(${Math.round(Math.random() * 360)}, 100%, 45%)`,
    });
  }
  function handleCancel() {
    setShowDialog(false);
    setTitle("");
    setDescription("");
  }
  return (
    <div className="EventsList">
      <Dialog show={showDialog} onOk={handleAddEvent} onCancel={handleCancel}>
        <TextField value={title} onInput={(value) => setTitle(value)} />
        <TextArea
          value={description}
          onInput={(value) => setDescription(value)}
        />
      </Dialog>
      <button
        className="EventsList__create_event_btn"
        onClick={() => setShowDialog(true)}
      >
        Create event
      </button>

      {events.map((e, i) => (
        <EventsListItem key={e.id} event={e} onRemove={() => removeEvent(i)} />
      ))}
    </div>
  );
}

function EventsListItem({
  event,
  onRemove,
}: {
  event: IUserEvent;
  onRemove?: () => void;
}) {
  return (
    <div
      className="EventsList__item" /*style={{ backgroundColor: event.color }} */
    >
      <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
        <span className="EventsList__item__title">{event.title}</span>
        <span className="EventsList__item__datetime">
          {new Date(event.date).toLocaleString([], { dateStyle: "long" })}
        </span>
        <span className="EventsList__item__description">
          {event.description}
        </span>
      </div>
      <div>
        <IconButton icon="edit" />
        <IconButton icon="delete" onClick={onRemove} />{" "}
      </div>
    </div>
  );
}
