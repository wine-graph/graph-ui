import React from "react";

type Props = {
  state: "idle" | "uploading" | "reviewing" | "confirming" | "success" | "error";
  canUpload: boolean;
  canConfirm: boolean;
  onUpload: () => void;
  onConfirm: () => void;
};

export const ImportActionBar: React.FC<Props> = ({ state, canUpload, canConfirm, onUpload, onConfirm }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {state === "idle" || state === "error" ? (
        <button className="btn btn-primary" disabled={!canUpload} onClick={onUpload}>
          Upload & Import
        </button>
      ) : null}

      {state === "reviewing" ? (
        <button className="btn btn-primary" disabled={!canConfirm} onClick={onConfirm}>
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
