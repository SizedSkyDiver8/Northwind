import React from "react";

interface ModalStatusProps {
  type: "delete" | "success" | "error";
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  icon?: React.ReactNode;
  showActions?: boolean;
}

const ModalStatus: React.FC<ModalStatusProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  type,
  message,
  icon,
  showActions = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {type !== "success" && (
          <button className="modal-close" onClick={onCancel}>
            &times;
          </button>
        )}

        <div className="modal-icon">{icon}</div>

        <div>
          <h3 className="modal-title">{message}</h3>

          {showActions && (
            <div className="modal-actions">
              <button className="btn-danger" onClick={onConfirm}>
                Yes, I'm sure
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                No, cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalStatus;
