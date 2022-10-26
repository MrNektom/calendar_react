import { useStore } from "effector-react";
import React from "react";
import { $layoutType } from "../../store/store";

export function PeriodLabel() {
  const layoutType = useStore($layoutType);

  const label = layoutType;
  return <span>{label}</span>;
}
