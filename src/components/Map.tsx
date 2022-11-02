import React, { Fragment, Key } from "react";

export function Map<T>({
  children,
  arr,
  k,
}: {
  children: (value: T, index: number, array: T[]) => JSX.Element;
  arr: T[];
  k: (value: T, index: number, array: T[]) => Key;
}) {
  return (
    <>
      {arr.map((value, index) => (
        <Fragment key={k(value, index, arr)}>
          {children(value, index, arr)}
        </Fragment>
      ))}
    </>
  );
}
