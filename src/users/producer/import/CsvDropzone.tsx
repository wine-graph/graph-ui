import React, {useCallback, useRef} from "react";

type Props = {
  file?: File;
  onFileSelected: (file: File) => void;
};

export const CsvDropzone: React.FC<Props> = ({ file, onFileSelected }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.toLowerCase().endsWith(".csv")) onFileSelected(f);
  }, [onFileSelected]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.toLowerCase().endsWith(".csv")) onFileSelected(f);
  }, [onFileSelected]);

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border border-token rounded-[var(--radius-md)] p-6 text-center cursor-pointer select-none"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload CSV"
        role="button"
      >
        <p className="text-[14px] text-muted">Drag a CSV here, or click to browse.</p>
        <p className="text-[12px] text-muted mt-1">Accepted: .csv</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={onChange}
      />

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
