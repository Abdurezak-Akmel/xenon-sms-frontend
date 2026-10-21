"use client";

import { useState } from "react";
import { Download, FilePlus2, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  ApplicationFileUploadCard,
  type PendingApplicationFile,
} from "./ApplicationFileUploadCard";

export type ApplicationFileReference = {
  id: string;
  originalName: string;
  mimeType?: string | null;
  sizeBytes?: number;
};

type ApplicationFileUploadsProps = {
  existingFiles: ApplicationFileReference[];
  onDownloadExistingFile: (file: ApplicationFileReference) => void;
  onRemoveExistingFile: (file: ApplicationFileReference) => void;
  pendingFiles: PendingApplicationFile[];
  onPendingFilesChange: (files: PendingApplicationFile[]) => void;
  disabled?: boolean;
};

function createPendingFile(): PendingApplicationFile {
  return { key: crypto.randomUUID(), file: null, originalName: "" };
}

export function ApplicationFileUploads({
  existingFiles,
  onDownloadExistingFile,
  onRemoveExistingFile,
  pendingFiles,
  onPendingFilesChange,
  disabled = false,
}: ApplicationFileUploadsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function updatePendingFile(key: string, updated: PendingApplicationFile) {
    onPendingFilesChange(
      pendingFiles.map((item) => (item.key === key ? updated : item)),
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-sm font-semibold text-(--foreground)">
            Supporting files
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-(--muted)">
            Manage attached documents or add new files to your application.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!isOpen && !pendingFiles.length) {
              onPendingFilesChange([createPendingFile()]);
            }
            setIsOpen((open) => !open);
          }}
          disabled={disabled}
          aria-expanded={isOpen}
        >
          {isOpen ? <X /> : <FilePlus2 />}
          {isOpen ? "Close file form" : "Add files"}
          {existingFiles.length + pendingFiles.length > 0 &&
            ` (${existingFiles.length + pendingFiles.length})`}
        </Button>
      </div>

      {isOpen && (
        <div className="grid gap-4 rounded-xl border border-(--line) bg-(--card) p-4">
          <p className="m-0 text-xs leading-relaxed text-(--muted)">
            Add one or more files to include with your application. Files are
            uploaded when you submit or save.
          </p>
          {pendingFiles.length > 0 ? (
            <div className="grid gap-3">
              {pendingFiles.map((item, index) => (
                <ApplicationFileUploadCard
                  key={item.key}
                  item={item}
                  index={index}
                  disabled={disabled}
                  onChange={(updated) =>
                    updatePendingFile(item.key, updated)
                  }
                  onRemove={() =>
                    onPendingFilesChange(
                      pendingFiles.filter((pending) => pending.key !== item.key),
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <p className="m-0 rounded-lg border border-dashed border-(--line) p-6 text-center text-sm text-(--muted)">
              No new files added.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onPendingFilesChange([...pendingFiles, createPendingFile()])
            }
            disabled={disabled}
            className="justify-self-start"
          >
            <Plus />
            Add another file
          </Button>
        </div>
      )}

      {existingFiles.length > 0 && (
        <section className="grid gap-2" aria-label="Attached files">
          <div>
            <h4 className="m-0 text-xs font-semibold text-(--foreground)">
              Attached files
            </h4>
            <p className="mt-1 text-xs text-(--muted)">
              Removing a file takes effect when you save the application.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-2 p-0">
            {existingFiles.map((file) => (
              <li
                key={file.id}
                className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-(--line) px-3 py-2 text-xs"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="truncate text-(--foreground)">
                    {file.originalName}
                  </span>
                  {typeof file.sizeBytes === "number" && (
                    <span className="shrink-0 text-(--muted)">
                      {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onDownloadExistingFile(file)}
                    disabled={disabled}
                    aria-label={`Download ${file.originalName}`}
                  >
                    <Download />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveExistingFile(file)}
                    disabled={disabled}
                    aria-label={`Remove ${file.originalName}`}
                    className="text-(--red)"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
