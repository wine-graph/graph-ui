import React, {useCallback, useRef} from "react";
import {Upload} from "lucide-react";

type Props = {
  file?: File;
  onFileSelected: (file: File) => void;
};

export const CsvDropzone: React.FC<Props> = ({ file, onFileSelected }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const hasFile = Boolean(file);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setFileError("Only .csv files are supported.");
      return;
    }
    setFileError(null);
    onFileSelected(f);
  }, [onFileSelected]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setFileError("Only .csv files are supported.");
      return;
    }
    setFileError(null);
    onFileSelected(f);
  }, [onFileSelected]);

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`rounded-[var(--radius-md)] border p-6 text-center cursor-pointer select-none transition-colors
          ${hasFile
            ? "border-token hover:bg-[color:var(--color-muted)]/20"
            : "border-dashed border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]/55 hover:bg-[color:var(--color-accent-soft)]"
          }
        `}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload CSV"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-token bg-[color:var(--color-panel)]">
          <Upload className="h-5 w-5 text-[color:var(--color-accent)]" aria-hidden="true"/>
        </div>
        <p className="text-[14px] font-medium">{hasFile ? "Replace CSV file" : "Upload CSV file"}</p>
        <p className="mt-1 text-[13px] text-muted">Drag a CSV here, or click to browse.</p>
        <p className="text-[12px] text-muted mt-1">Accepted: .csv</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={onChange}
      />

      {fileError ? (
        <div className="mt-2 text-[12px] text-[color:var(--color-danger)]" role="alert">
          {fileError}
        </div>
      ) : null}

      {file ? (
        <div className="mt-3 flex items-center justify-between border border-token rounded-md p-3">
          <div className="text-[14px]">
            <div className="font-medium">{file.name}</div>
            <div className="text-[12px] text-muted">{formatSize(file.size)}</div>
          </div>
          <button className="btn btn-secondary" onClick={() => inputRef.current?.click()}>Replace</button>
        </div>
      ) : null}
    </div>
  );
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default CsvDropzone;
