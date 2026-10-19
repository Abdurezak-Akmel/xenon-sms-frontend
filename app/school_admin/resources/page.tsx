"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Download,
  File,
  Files,
  Globe2,
  HardDrive,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { ConfirmModal } from "@/components/ui/Modal";

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
  deleteFileObject,
  downloadFileObject,
  listFileObjects,
  uploadBranchFileObject,
  uploadTenantFileObject,
  type FileObject,
} from "@/services/files/file_objs.service";

import { getAuthenticatedTenantId } from "@/services/auth/user.service";
import { listBranches, type Branch } from "@/services/tenancy/branch.service";

import styles from "./page.module.css";

type UploadScope = "tenant" | "branch";

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<UploadScope>("tenant");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingFile, setDeletingFile] = useState<FileObject | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await listFileObjects();
      setFiles(response.fileObjects);
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
    async function loadBranches() {
      try {
        const authenticatedTenantId = getAuthenticatedTenantId();
        setTenantId(authenticatedTenantId);
        const response = await listBranches({
          tenantId: authenticatedTenantId,
        });
        setBranches(response.branches);
      } catch (error: unknown) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Unable to load your school's branches.",
        );
      }
    }
    void loadBranches();
  }, [loadFiles]);

  const availableFiles = useMemo(
    () =>
      files.filter(
        (item) =>
          (item.tenantId === null && item.branchId === null) ||
          (item.tenantId === tenantId && item.branchId === null) ||
          (item.tenantId === tenantId && item.branchId !== null),
      ),
    [files, tenantId],
  );

  const filteredFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    return availableFiles.filter((item) =>
      [item.originalName, item.mimeType ?? "", item.id].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [availableFiles, query]);

  const branchFiles = availableFiles.filter(
    (item) => item.tenantId === tenantId && item.branchId !== null,
  );
  const tenantFiles = availableFiles.filter(
    (item) => item.tenantId === tenantId && item.branchId === null,
  );
  const totalSize = availableFiles.reduce(
    (sum, item) => sum + item.sizeBytes,
    0,
  );
  const stats: TenantStat[] = [
    {
      label: "Global resources",
      value: availableFiles.filter(
        (item) => item.tenantId === null && item.branchId === null,
      ).length,
      helper: "Available platform-wide",
      tone: "blue",
      icon: Globe2,
    },
    {
      label: "Branch resources",
      value: branchFiles.length,
      helper: "Available across your school's branches",
      tone: "green",
      icon: MapPin,
    },
    {
      label: "School-wide resources",
      value: tenantFiles.length,
      helper: "Available across your school",
      tone: "orange",
      icon: Building2,
    },
    {
      label: "Storage used",
      value: formatBytes(totalSize),
      helper: "Combined file size",
      tone: "orange",
      icon: HardDrive,
    },
  ];

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedFile) {
      setActionError("Choose a file to upload.");
      return;
    }
    if (!tenantId) {
      setActionError("Unable to identify your school. Sign in again.");
      return;
    }
    if (scope === "branch" && !branches.some((item) => item.id === branchId)) {
      setActionError("Choose a branch in your school.");
      return;
    }
    setUploading(true);
    setActionError(null);
    setNotice(null);
    try {
      if (scope === "tenant") {
        await uploadTenantFileObject(tenantId, selectedFile);
      } else {
        await uploadBranchFileObject(tenantId, branchId, selectedFile);
      }
      setSelectedFile(null);
      form.reset();
      setNotice("Resource uploaded successfully.");
      await loadFiles();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to upload resource.",
      );
    } finally {
      setUploading(false);
    }
  }

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

  async function handleDelete() {
    if (!deletingFile) return;
    setSaving(true);
    setActionError(null);
    try {
      await deleteFileObject(deletingFile.id);
      setFiles((current) =>
        current.filter((item) => item.id !== deletingFile.id),
      );
      setDeletingFile(null);
      setNotice("Resource deleted.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete resource.",
      );
    } finally {
      setSaving(false);
    }
  }

  function scopeLabel(fileObject: FileObject) {
    if (fileObject.tenantId === null && fileObject.branchId === null) {
      return "Global";
    }
    if (fileObject.tenantId === tenantId && fileObject.branchId === null) {
      return "School-wide";
    }
    return (
      branches.find((branch) => branch.id === fileObject.branchId)?.name ??
      "Branch"
    );
  }

  return (
    <main className={styles.resourcesPage}>
      <div className="content">
        <TenantPageHeader
          styles={styles}
          icon={Files}
          eyebrow="School administration / Resources"
          title="School resources"
          subtitle="Browse global, school-wide, and branch resources available across your school."
          details={
            <p className={styles.headerNote}>
              <Globe2 size={14} />
              Maximum upload size is 25 MB per file.
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
          ariaLabel="Resource summary"
        />

        {(loadError || actionError || notice) && (
          <div
            role={loadError || actionError ? "alert" : "status"}
            className={
              loadError || actionError
                ? styles.errorNotice
                : styles.successNotice
            }
          >
            <span>{loadError ?? actionError ?? notice}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setLoadError(null);
                setActionError(null);
                setNotice(null);
              }}
              aria-label="Dismiss message"
            >
              <X />
            </Button>
          </div>
        )}

        <section className={`panel ${styles.uploadPanel}`}>
          <div className={styles.uploadHeading}>
            <div className={styles.uploadHeadingIcon}>
              <Upload size={19} />
            </div>
            <div>
              <p className={styles.uploadEyebrow}>Add to library</p>
              <h2>Upload a resource</h2>
              <p className={styles.uploadDescription}>
                Share a file with your school or one of its branches.
              </p>
            </div>
            <span className={styles.uploadLimit}>MAX 25 MB</span>
          </div>
          <form className={styles.uploadForm} onSubmit={handleUpload}>
            <fieldset className={styles.scopeFieldset}>
              <legend>Where should this resource be available?</legend>
              <div className={styles.scopeChoices}>
                {[
                  {
                    value: "tenant" as const,
                    label: "Entire school",
                    description: "Shared across your school",
                    icon: Building2,
                  },
                  {
                    value: "branch" as const,
                    label: "One branch",
                    description: "Limited to one of your branches",
                    icon: MapPin,
                  },
                ].map(({ value, label, description, icon: ScopeIcon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.scopeChoice} ${scope === value ? styles.scopeChoiceActive : ""}`}
                    aria-pressed={scope === value}
                    onClick={() => {
                      setScope(value);
                      setBranchId("");
                      setActionError(null);
                    }}
                  >
                    <ScopeIcon size={17} />
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <span className={styles.scopeRadio} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </fieldset>
            {scope === "branch" && (
              <div className={styles.scopeDetails}>
                <label className={styles.formField}>
                  <span>Branch</span>
                  <select
                    value={branchId}
                    onChange={(event) => setBranchId(event.target.value)}
                    required
                    disabled={branches.length === 0}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                {branches.length === 0 && (
                  <p className={styles.uploadDescription}>
                    No branches are available for your school.
                  </p>
                )}
              </div>
            )}
            <p className={styles.headerNote}>
              {scope === "tenant" ? (
                <Building2 size={14} />
              ) : (
                <MapPin size={14} />
              )}
              {scope === "tenant"
                ? "School-wide uploads are available to users across your school."
                : "Branch uploads are limited to the selected branch. Global resources are view-only."}
            </p>
            <div className={styles.uploadBottomRow}>
              <label className={styles.fileDropzone}>
                <input
                  type="file"
                  required
                  onChange={(event) =>
                    setSelectedFile(event.currentTarget.files?.[0] ?? null)
                  }
                />
                <span className={styles.fileDropIcon}>
                  <Upload size={18} />
                </span>
                <span className={styles.fileDropCopy}>
                  <strong>
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a file to upload"}
                  </strong>
                  <small>
                    {selectedFile
                      ? `${formatBytes(selectedFile.size)} · Ready to upload`
                      : "Select from your device · Max file size 25 MB"}
                  </small>
                </span>
                <span className={styles.browseButton}>Browse files</span>
              </label>
              <Button
                type="submit"
                className={styles.uploadSubmit}
                disabled={uploading || loading}
              >
                {uploading ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <Upload />
                )}
                {uploading ? "Uploading…" : "Upload resource"}
              </Button>
            </div>
          </form>
        </section>

        <section className={`panel ${styles.resourcesPanel}`}>
          <div className="panel-heading">
            <div>
              <h2>
                Resource library
                <span className={styles.directoryCount}>
                  {loading ? "…" : availableFiles.length}
                </span>
              </h2>
              <p>
                Global resources and all resources belonging to your school and
                its branches.
              </p>
            </div>
            <span>
              {filteredFiles.length} of {availableFiles.length} shown
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
                  description="Fetching available platform and school files."
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
                    availableFiles.length
                      ? "No matching resources"
                      : "No resources yet"
                  }
                  description={
                    availableFiles.length
                      ? "Try another search term."
                      : "Upload a file above to begin building the resource library."
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
                      <span className={styles.scopeBadge}>
                        {scopeLabel(item)}
                      </span>
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
                        {tenantId !== "" && item.tenantId === tenantId && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            title="Delete resource"
                            aria-label={`Delete ${item.originalName}`}
                            onClick={() => setDeletingFile(item)}
                          >
                            <Trash2 />
                          </Button>
                        )}
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

      <ConfirmModal
        isOpen={deletingFile !== null}
        onClose={() => setDeletingFile(null)}
        onConfirm={() => void handleDelete()}
        title="Delete resource?"
        description={
          deletingFile
            ? `"${deletingFile.originalName}" will be deleted and removed from storage. This cannot be undone.`
            : "This resource will be deleted."
        }
        confirmText="Delete resource"
        isLoading={saving}
      />
    </main>
  );
}
