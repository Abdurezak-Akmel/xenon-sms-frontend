"use client";

import { FileText, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";

export type PendingApplicationFile = {
  key: string;
  file: File | null;
  originalName: string;
};

type ApplicationFileUploadCardProps = {
  item: PendingApplicationFile;
  index: number;
  disabled?: boolean;
  onChange: (item: PendingApplicationFile) => void;
  onRemove: () => void;
};

export function ApplicationFileUploadCard({
  item,
  index,
  disabled = false,
  onChange,
  onRemove,
}: ApplicationFileUploadCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-(--line) bg-(--background) p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
      <label className="grid min-w-0 gap-2 text-xs font-semibold text-(--foreground)">
        <span className="flex items-center gap-2">
          <Upload className="size-4 text-(--blue)" />
          File {index + 1} <b className="text-(--red)">*</b>
        </span>
        <input
          type="file"
          required
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onChange({
              ...item,
              file,
              originalName:
                !item.originalName || item.originalName === item.file?.name
                  ? (file?.name ?? "")
                  : item.originalName,
            });
          }}
          className="block w-full min-w-0 rounded-lg border border-(--line) bg-(--card) p-2 text-xs text-(--foreground) file:mr-3 file:rounded-md file:border-0 file:bg-(--background) file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-(--foreground)"
        />
        <span className="font-normal text-(--muted)">
          Maximum file size: 25 MB
        </span>
      </label>

      <label className="grid min-w-0 gap-2 text-xs font-semibold text-(--foreground)">
        <span>
          File name <b className="text-(--red)">*</b>
        </span>
        <input
          type="text"
          required
          maxLength={255}
          value={item.originalName}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...item, originalName: event.target.value })
          }
          placeholder="Name shown to the admissions team"
          className="h-10 w-full rounded-lg border border-(--line) bg-(--card) px-3 text-sm text-(--foreground) outline-none focus:border-(--blue)"
        />
      </label>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove file ${index + 1}`}
        className="justify-self-end text-(--red)"
      >
        <Trash2 />
      </Button>

      {item.file && (
        <p className="flex items-center gap-2 text-xs text-(--muted) sm:col-span-2">
          <FileText className="size-4 shrink-0" />
          <span className="truncate">{item.file.name}</span>
          <span className="shrink-0">
            ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </p>
      )}
    </article>
  );
}
