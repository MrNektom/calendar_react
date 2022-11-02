import React, {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Portal } from "../Portal";
import "./Popup.css";
import {
  CSSTransition,
  Transition,
  TransitionStatus,
} from "react-transition-group";
import { match, P } from "ts-pattern";

interface IPopupProps {
  show: boolean;
  anchor?: React.RefObject<Element | null>;
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  children?: JSX.Element | JSX.Element[] | string | null;
  onHide?: () => void;
}

const styles: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: { opacity: 1, overflow: "hidden", transform: "scale(1)" },
  entered: { opacity: 1, overflowY: "auto", transform: "scale(1)" },
  exiting: { opacity: 0, overflow: "hidden", transform: "scale(0.5)" },
  exited: { opacity: 0, transform: "scale(0.5)" },
  unmounted: { transform: "scale(0.5)" },
};

export function Popup({ show, children, anchor, onHide }: IPopupProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const { x, y } = anchor?.current?.getBoundingClientRect() || { x: 0, y: 0 };
  const { width = 0, height = 0 } =
    popupRef.current?.getBoundingClientRect() || { width: 0, height: 0 };

  useEffect(() => {
    if (contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setSize({ w: width, h: height });
    }
  }, [contentRef.current, show]);

  useLayoutEffect(() => {
    console.log(x, y);
  }, [x, y]);

  return (
    <Portal>
      <CSSTransition
        in={show}
        nodeRef={overlayRef}
        addEndListener={(end) =>
          overlayRef.current?.addEventListener("transitionend", end)
        }
        unmountOnExit
        mountOnEnter
      >
        <div className="Popup__overlay" ref={overlayRef} onClick={onHide}></div>
      </CSSTransition>
      <Transition
        in={show}
        addEndListener={(end) =>
          popupRef.current?.addEventListener("transitionend", end)
        }
        nodeRef={popupRef}
        unmountOnExit
        mountOnEnter
      >
        {(state) => {
          return (
            <div
              ref={popupRef}
              className="Popup"
              style={{
                ...styles[state],
                left: `${(x / innerWidth) * 100}%`,
                top: `${(y / innerHeight) * 100}%`,
                transformOrigin: "left top",
              }}
            >
              <div className="Popup__content" ref={contentRef}>
                {children}
              </div>
            </div>
          );
        }}
      </Transition>
    </Portal>
  );
}
