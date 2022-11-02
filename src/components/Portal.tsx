import ReactDOM from "react-dom";

export function Portal({
  destination = document.body,
  children,
}: {
  destination?: Element;
  children?: JSX.Element | JSX.Element[] | string | null;
}): JSX.Element {
  return ReactDOM.createPortal(children, destination);
}
