import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Spinner from "../../../components/common/Spinner";
import {useImportMachine} from "./useImportMachine";
import CsvDropzone from "./CsvDropzone";
import ImportActionBar from "./ImportActionBar";
import WinesPreviewTable from "./WinesPreviewTable";
import ImportResultsSummary from "./ImportResultsSummary";
import ImportErrorsPanel from "./ImportErrorsPanel";
import AdvancedDrawer from "./AdvancedDrawer";

type Props = { producerId: string };

/**
 * ProducerWinesImport
 *
 * A self-contained import component (no page shell) to be embedded inside ProducerInventory.
 */
const ProducerWinesImport: React.FC<Props> = ({producerId}) => {
  const machine = useImportMachine(producerId ?? "");

  // Advanced options (MVP: not sent to backend yet)
  const [maxRows, setMaxRows] = useState<number>(100);
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [strictMode, setStrictMode] = useState<boolean>(false);

  const canUpload = !!machine.ctx.file && machine.state === "idle";
  const canConfirm = machine.state === "reviewing" && machine.invalids.length === 0 && machine.ctx.editableWines.length > 0;

  // Overlay copy
  const overlay = useMemo(() => {
    if (machine.state === "uploading") return { title: "Our AI sommelier is parsing your data…", sub: "This takes a few moments so please be patient." };
    if (machine.state === "confirming") return { title: "Saving wines to your catalog…", sub: undefined };
    return null;
  }, [machine.state]);

  return (
    <section className="relative" aria-labelledby="import-heading">
      <div className="panel-token border border-token rounded-[var(--radius-md)] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 id="import-heading" className="text-[16px] font-medium">Import wines</h2>
          <div className="text-[13px] text-muted">CSV only</div>
        </div>

        {/* Step 1: File */}
        <div className="mt-4">
          <h3 className="text-[14px] font-medium">Step 1: File</h3>
          <div className="mt-2">
            <CsvDropzone file={machine.ctx.file} onFileSelected={machine.selectFile} />
          </div>
        </div>

        {/* Step 2: Import */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-[14px] font-medium">Step 2: Import</h3>
          <ImportActionBar
            state={machine.state}
            canUpload={canUpload}
            canConfirm={canConfirm}
            onUpload={machine.upload}
            onConfirm={machine.confirm}
          />
        </div>

        {/* Error banner */}
        {machine.state === "error" && machine.ctx.error ? (
          <div className="mt-3 border border-danger rounded-md p-3 text-[14px]">
            <div className="font-medium">Import failed</div>
            <div className="text-[13px] text-muted mt-1">{machine.ctx.error}</div>
            <div className="mt-2">
              <button className="btn btn-secondary" onClick={machine.reset}>Try again</button>
            </div>
          </div>
        ) : null}

        {/* Reviewing table */}
        {machine.state === "reviewing" ? (
          <div className="mt-4">
            <WinesPreviewTable wines={machine.ctx.editableWines} onEdit={machine.editWine} invalids={machine.invalids} />
            {machine.ctx.extraction?.errors && machine.ctx.extraction.errors.length > 0 ? (
              <div className="mt-3">
                <ImportErrorsPanel errors={machine.ctx.extraction.errors} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Success results */}
        {machine.state === "success" && machine.ctx.result ? (
          <div className="mt-4 space-y-4">
            <div role="status" aria-live="polite" className="text-[14px]">Imported {machine.ctx.result.saved} wines{machine.ctx.result.failed > 0 ? ` (${machine.ctx.result.failed} failed)` : ""}.</div>
            <ImportResultsSummary result={machine.ctx.result} />
            {machine.ctx.result.errors && machine.ctx.result.errors.length > 0 ? (
              <ImportErrorsPanel errors={machine.ctx.result.errors} />
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => machine.reset()}>Import another file</button>
              <Link to={`/producer/${producerId}/inventory`} className="btn btn-primary">View wines</Link>
            </div>
          </div>
        ) : null}

        {/* Advanced */}
        <AdvancedDrawer
          maxRows={maxRows}
          onMaxRowsChange={setMaxRows}
          dryRun={dryRun}
          onDryRunChange={setDryRun}
          strictMode={strictMode}
          onStrictModeChange={setStrictMode}
        />
      </div>

      {/* Blocking overlay */}
      {overlay ? (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-[var(--radius-md)]">
          <Spinner label={overlay.title} />
          {overlay.sub ? <div className="text-[13px] text-muted mt-2">{overlay.sub}</div> : null}
        </div>
      ) : null}
    </section>
  );
};

export default ProducerWinesImport;
