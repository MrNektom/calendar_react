import { createEvent, createStore } from "effector";
import { useEvent, useStore } from "effector-react";
import React, { useState } from "react";
import {
  $eventsList,
  eventAdded,
  eventEdited,
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

interface IEventListProps {
  eventShow?: number;
  onShowEvent?: (id: number) => void;
}

export function EventsList({
  eventShow = -1,
  onShowEvent: onView,
}: IEventListProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<[number, IUserEvent] | null>(null);
  const events = useStore($eventsList);
  const addEvent = useEvent(eventAdded);
  const removeEvent = useEvent(eventRemoved);
  const editEvent = useEvent(eventEdited);

  function handleAddEvent() {
    setShowDialog(false);
    setTitle("");
    setDescription("");
    if (editing) {
      setEditing(null);
      editEvent([
        editing[0],
        {
          title,
          description,
          id: editing[1].id,
          color: editing[1].color,
          date: editing[1].date,
        },
      ]);
    } else
      addEvent({
        id: ++last_id,
        title,
        date: Date.now(),
        description,
        color: `hsl(${Math.round(Math.random() * 360)}, 100%, 45%)`,
      });
  }
  function handleCancel() {
    if (editing) setEditing(null);
    setShowDialog(false);
    setTitle("");
    setDescription("");
  }

  function startEditing(index: number) {
    setEditing([index, events[index]]);
    setTitle(events[index].title);
    setDescription(events[index].description);
    setShowDialog(true);
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
        <EventsListItem
          key={e.id}
          event={e}
          scrollIntroView={e.id === eventShow}
          onRemove={() => removeEvent(i)}
          onEdit={() => startEditing(i)}
          onView={() => onView?.call(null, -1)}
        />
      ))}
    </div>
  );
}

function EventsListItem({
  event,
  scrollIntroView,
  onRemove,
  onEdit,
  onView,
}: {
  event: IUserEvent;
  scrollIntroView: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}) {
  const [highlight, setHighlight] = useState(false);
  function handleScroll(el: HTMLElement) {
    el.scrollIntoView({ block: "center" });
    onView && onView();
    setHighlight(true);
  }

  if (highlight) {
    setTimeout(() => {
      setHighlight(false);
    }, 1000);
  }
  return (
    <div
      className={`EventsList__item ${
        (highlight && "highlight") || ""
      }`} /*style={{ backgroundColor: event.color }} */
      ref={(el) => el && scrollIntroView && onView && handleScroll(el)}
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
        <IconButton icon="edit" onClick={onEdit} />
        <IconButton icon="delete" onClick={onRemove} />{" "}
      </div>
    </div>
  );
}
