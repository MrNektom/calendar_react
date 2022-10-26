import React from "react";
import { Icon, TIconKind } from "../Icon/Icon";
import "./IconButton.css";

interface IButtonProps {
  icon: TIconKind;
  onClick?: () => void;
}
export function IconButton({ icon, onClick }: IButtonProps) {
  return (
    <button className="IconButton" onClick={onClick}>
      <Icon icon={icon} />
    </button>
  );
}
