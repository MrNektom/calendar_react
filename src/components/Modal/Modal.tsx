import React from "react";
import ReactDOM from "react-dom";

export interface IModalProps {
  show: boolean;
  children: JSX.Element[] | JSX.Element;
  style?: React.CSSProperties;
  onCancel?: () => void;
}

export function Modal({
  show = false,
  children,
  style,
  onCancel,
}: IModalProps) {
  return (
    <>
      {show &&
        ReactDOM.createPortal(
          <div
            onClick={(e) =>
              e.target === e.currentTarget && onCancel && onCancel()
            }
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "#0003",
              zIndex: "10000",
              ...style,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
