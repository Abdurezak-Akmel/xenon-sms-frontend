"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  File,
  Files,
  Globe2,
  HardDrive,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { TenantPageHeader } from "@/components/tenants/TenantPageHeader";

import {
  TenantStatsCards,
  type TenantStat,
} from "@/components/tenants/TenantStatsCards";

import { Footer } from "@/components/ui/footer";

import {
  downloadFileObject,
  listFileObjects,
  type FileObject,
} from "@/services/files/file_objs.service";

import styles from "./page.module.css";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export default function ResourcesPage() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await listFileObjects();
      setFiles(
        response.fileObjects.filter(
          (item) => item.tenantId === null && item.branchId === null,
        ),
      );
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load resources.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const filteredFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    return files.filter((item) =>
      [item.originalName, item.mimeType ?? "", item.id].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [files, query]);

  const totalSize = files.reduce((sum, item) => sum + item.sizeBytes, 0);
  const stats: TenantStat[] = [
    {
      label: "Global resources",
      value: files.length,
      helper: "Available platform-wide",
      tone: "blue",
      icon: Globe2,
    },
    {
      label: "Storage used",
      value: formatBytes(totalSize),
      helper: "Combined size of available files",
      tone: "orange",
      icon: HardDrive,
    },
  ];

  async function handleDownload(fileObject: FileObject) {
    setActionError(null);
    try {
      const blob = await downloadFileObject(fileObject.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileObject.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to download resource.",
      );
    }
  }

  return (
    <main className={styles.resourcesPage}>
      <div className="content">
        <TenantPageHeader
          styles={styles}
          icon={Files}
          eyebrow="Guest workspace / Resources"
          title="Global resources"
          subtitle="Browse and download resources made available to everyone."
          details={
            <p className={styles.headerNote}>
              <Globe2 size={14} />
              Resources are read-only in the guest workspace.
            </p>
          }
          action={
            <Button
              type="button"
              variant="outline"
              className={styles.refreshButton}
              onClick={() => void loadFiles()}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          }
        />

        <TenantStatsCards
          stats={stats}
          loading={loading}
          className={styles.metricsGrid}
          ariaLabel="Global resource summary"
        />

        {(loadError || actionError) && (
          <div role="alert" className={styles.errorNotice}>
            <span>{loadError ?? actionError}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setLoadError(null);
                setActionError(null);
              }}
              aria-label="Dismiss message"
            >
              <X />
            </Button>
          </div>
        )}

        <section className={`panel ${styles.resourcesPanel}`}>
          <div className="panel-heading">
            <div>
              <h2>
                Resource library
                <span className={styles.directoryCount}>
                  {loading ? "…" : files.length}
                </span>
              </h2>
              <p>Global resources available to all users.</p>
            </div>
            <span>
              {filteredFiles.length} of {files.length} shown
            </span>
          </div>
          <label className={styles.searchControl}>
            <Search size={16} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources by name or file ID"
              aria-label="Search resources"
            />
          </label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty
                  colSpan={5}
                  title="Loading resources"
                  description="Fetching global resources."
                />
              ) : loadError ? (
                <TableEmpty
                  colSpan={5}
                  title="Resources could not be loaded"
                  description="Refresh the page or try again in a moment."
                />
              ) : filteredFiles.length === 0 ? (
                <TableEmpty
                  colSpan={5}
                  title={
                    files.length ? "No matching resources" : "No resources yet"
                  }
                  description={
                    files.length
                      ? "Try another search term."
                      : "There are no global resources available yet."
                  }
                  icon={<File size={22} />}
                />
              ) : (
                filteredFiles.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-56">
                      <div className={styles.fileName}>
                        <span className={styles.fileIcon}>
                          <File size={16} />
                        </span>
                        <span>
                          <strong>{item.originalName}</strong>
                          <small>{item.mimeType ?? "Unknown file type"}</small>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={styles.scopeBadge}>Global</span>
                    </TableCell>
                    <TableCell>{formatBytes(item.sizeBytes)}</TableCell>
                    <TableCell>{formatDate(item.uploadedAt)}</TableCell>
                    <TableCell>
                      <div className={styles.rowActions}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title="Download resource"
                          aria-label={`Download ${item.originalName}`}
                          onClick={() => void handleDownload(item)}
                        >
                          <Download />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
        <Footer year={2026} />
      </div>
    </main>
  );
}
