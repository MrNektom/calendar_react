import React from "react";
import { IModalProps, Modal } from "../Modal/Modal";
import "./Dialog.css";

interface IDialogProps extends IModalProps {
  title?: string;
  okBtnLabel?: string;
  cancelBtnLabel?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

export function Dialog({
  show,
  children,
  title,
  okBtnLabel,
  onOk,
  cancelBtnLabel,
  onCancel,
}: IDialogProps): JSX.Element {
  return (
    <Modal show={show} onCancel={onCancel}>
      <div className="dialog">
        {title && <div className="dialog_header">{title}</div>}
        <div className="dialog_content">{children}</div>
        <div className="dialog_footer">
          {(onOk || !!okBtnLabel) && (
            <button onClick={onOk}>{okBtnLabel || "Ok"}</button>
          )}
          {(onCancel || !!cancelBtnLabel) && (
            <button onClick={onCancel}>{cancelBtnLabel || "Cancel"}</button>
          )}
        </div>
      </div>
    </Modal>
  );
}
