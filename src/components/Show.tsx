import React from "react";

export function Show({
  children,
  cond,
}: {
  cond: unknown;
  children?: JSX.Element | JSX.Element[] | string;
}): JSX.Element {
  return <>{cond ? children || null : ""}</>;
}
