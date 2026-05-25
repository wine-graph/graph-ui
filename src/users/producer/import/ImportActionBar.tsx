import React from "react";

type Props = {
  state: "idle" | "uploading" | "reviewing" | "confirming" | "success" | "error";
  canUpload: boolean;
  canConfirm: boolean;
  disabledReason?: string;
  onUpload: () => void;
  onConfirm: () => void;
};

export const ImportActionBar: React.FC<Props> = ({ state, canUpload, canConfirm, disabledReason, onUpload, onConfirm }) => {
  const uploadDisabled = !canUpload;
  const confirmDisabled = !canConfirm;

  return (
    <div className="flex items-center justify-end gap-2">
      {state === "idle" || state === "error" ? (
        <button
          className={`btn btn-primary ${uploadDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={uploadDisabled}
          aria-disabled={uploadDisabled}
          onClick={onUpload}
          title={uploadDisabled ? disabledReason : undefined}
        >
          Upload & Import
        </button>
      ) : null}

      {state === "reviewing" ? (
        <button
          className={`btn btn-primary ${confirmDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={confirmDisabled}
          aria-disabled={confirmDisabled}
          onClick={onConfirm}
          title={confirmDisabled ? disabledReason : undefined}
        >
          Confirm import
        </button>
      ) : null}

      {state === "confirming" ? (
        <button className="btn btn-primary" disabled>
          Saving…
        </button>
      ) : null}

      {state === "uploading" ? (
        <button className="btn btn-primary" disabled>
          Importing…
        </button>
      ) : null}
    </div>
  );
};

export default ImportActionBar;
