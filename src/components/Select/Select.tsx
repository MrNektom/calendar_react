import React, { ReactElement, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Icon } from "../Icon/Icon";
import "./Select.css";

interface ISelectProps {
  children: ReactElement[];
  onSelected?: (index: number) => void;
}

export function Select({ children, onSelected }: ISelectProps) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  function expandToggle() {
    setExpanded(!expanded);
  }
  function select(i: number) {
    if (i !== selected) {
      setSelected(i);
      onSelected && onSelected(i);
    }
  }
  return (
    <CSSTransition
      in={expanded}
      nodeRef={selectRef}
      addEndListener={(end) =>
        selectRef.current?.addEventListener("transitionend", end)
      }
    >
      <div className="Select" ref={selectRef} onClick={expandToggle}>
        {children[selected]}
        <Icon icon={expanded ? "arrow_drop_up" : "arrow_drop_down"} />
        {expanded &&
          createPortal(<div className="Select__backdrop"></div>, document.body)}

        <div className="Select__items">
          {children.map((item, i) => (
            <div
              key={i.toString()}
              className={`Select__items__item ${
                selected === i ? "selected" : ""
              }`}
              onClick={() => select(i)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </CSSTransition>
  );
}
