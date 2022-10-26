import React from "react";
import "./Icon.css";

export type TIconKind =
  | "chevron_left"
  | "chevron_right"
  | "arrow_drop_down"
  | "arrow_drop_up"
  | "delete"
  | "edit";

interface IIconProps {
  icon: TIconKind;
}

export function Icon({ icon }: IIconProps) {
  return <span className="Icon material-icons">{icon}</span>;
}
