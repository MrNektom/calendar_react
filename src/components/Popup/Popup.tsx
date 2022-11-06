import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Portal } from "../Portal";
import "./Popup.css";
import { CSSTransition } from "react-transition-group";
import { Show } from "../Show";

interface IPopupProps {
  show: boolean;
  anchor?: React.RefObject<Element | null>;
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  children?: JSX.Element | JSX.Element[] | string | null;
  onHide?: () => void;
}

export function Popup({ show, children, anchor, onHide }: IPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [inFlag, setInFlag] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const contentRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    let w = 0,
      h = 0;
    if (popupRef.current) {
      const { width, height } = popupRef.current.getBoundingClientRect();
      setSize({ w: width, h: height });
      w = width;
      h = height;
    }
    if (anchor && anchor.current) {
      let { x, y } = anchor.current.getBoundingClientRect();
      if (y + h > innerHeight) {
        y = innerHeight - h - 10;
      }
      if (x + w > innerWidth) {
        x = innerWidth - w - 10;
      }
      setCoords({ x, y });
    }
    if (mounted) {
      setInFlag(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (show) {
      setMounted(true);
    } else {
      setInFlag(false);
    }
  }, [show]);

  return (
    <Portal>
      <Show cond={mounted}>
        <CSSTransition
          in={inFlag}
          nodeRef={overlayRef}
          addEndListener={(end) =>
            overlayRef.current?.addEventListener("transitionend", end)
          }
        >
          <div
            className="Popup__overlay"
            ref={overlayRef}
            onClick={onHide}
          ></div>
        </CSSTransition>
        <CSSTransition
          in={inFlag}
          addEndListener={(end) =>
            popupRef.current?.addEventListener("transitionend", end)
          }
          nodeRef={popupRef}
          onExited={() => setMounted(false)}
        >
          <div
            ref={popupRef}
            className="Popup"
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
            }}
          >
            <div className="Popup__content" ref={contentRef}>
              {children}
            </div>
          </div>
        </CSSTransition>
      </Show>
    </Portal>
  );
}
