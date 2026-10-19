"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  File,
  Files,
  Globe2,
  Building2,
  HardDrive,
  MapPin,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  ConfirmModal,
  Modal,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";

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
  updateFileObject,
  uploadBranchFileObject,
  uploadGlobalFileObject,
  uploadTenantFileObject,
  type FileObject,
} from "@/services/files/file_objs.service";

import { listBranches, type Branch } from "@/services/tenancy/branch.service";

import { listTenants, type Tenant } from "@/services/tenancy/tenant.service";

import styles from "./page.module.css";

type UploadScope = "global" | "tenant" | "branch";

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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<UploadScope>("global");
  const [tenantId, setTenantId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingFile, setEditingFile] = useState<FileObject | null>(null);
  const [editName, setEditName] = useState("");
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
    async function loadUploadOptions() {
      try {
        const { tenants: tenantRecords } = await listTenants();
        setTenants(tenantRecords);

        const branchResults = await Promise.all(
          tenantRecords.map((tenant) =>
            listBranches({ tenantId: tenant.id }),
          ),
        );
        setBranches(
          branchResults.flatMap(({ branches: branchRecords }) => branchRecords),
        );
      } catch (error: unknown) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Unable to load school and branch information.",
        );
      }
    }

    void loadUploadOptions();
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
      label: "Total resources",
      value: files.length,
      helper: "Files across all scopes",
      tone: "blue",
      icon: Files,
    },
    {
      label: "Global resources",
      value: files.filter((item) => !item.tenantId).length,
      helper: "Available platform-wide",
      tone: "green",
      icon: Globe2,
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
    if (scope !== "global" && !tenantId) {
      setActionError("Choose a school for this resource.");
      return;
    }
    if (scope === "branch" && !branchId) {
      setActionError("Choose a branch for this resource.");
      return;
    }

    setUploading(true);
    setActionError(null);
    setNotice(null);
    try {
      if (scope === "global") {
        await uploadGlobalFileObject(selectedFile);
      } else if (scope === "tenant") {
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

  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingFile || !editName.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      const { fileObject } = await updateFileObject(editingFile.id, {
        originalName: editName.trim(),
      });
      setFiles((current) =>
        current.map((item) => (item.id === fileObject.id ? fileObject : item)),
      );
      setEditingFile(null);
      setNotice("Resource renamed successfully.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to rename resource.",
      );
    } finally {
      setSaving(false);
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
    if (!fileObject.tenantId) return "Global";
    const tenant =
      tenants.find((item) => item.id === fileObject.tenantId)?.displayName ??
      "School";
    if (!fileObject.branchId) return tenant;
    const branch = branches.find((item) => item.id === fileObject.branchId);
    return `${tenant} / ${branch?.name ?? "Branch"}`;
  }

  return (
    <main className={styles.resourcesPage}>
      <div className="content">
        <TenantPageHeader
          styles={styles}
          icon={Files}
          eyebrow="Platform administration / Resources"
          title="Resources"
          subtitle="Upload and manage files available globally, to a school, or to an individual branch."
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
                Choose who can access your file, then add it to the library.
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
                    value: "global" as const,
                    label: "Everyone",
                    description: "Available across all schools",
                    icon: Globe2,
                  },
                  {
                    value: "tenant" as const,
                    label: "One school",
                    description: "Shared across a school",
                    icon: Building2,
                  },
                  {
                    value: "branch" as const,
                    label: "One branch",
                    description: "Limited to a single branch",
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
            {scope !== "global" && (
              <div className={styles.scopeDetails}>
                <label className={styles.formField}>
                  <span>School</span>
                  <select
                    value={tenantId}
                    onChange={(event) => {
                      setTenantId(event.target.value);
                      setBranchId("");
                    }}
                    required
                  >
                    <option value="">Select a school</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.displayName}
                      </option>
                    ))}
                  </select>
                </label>
                {scope === "branch" && (
                  <label className={styles.formField}>
                    <span>Branch</span>
                    <select
                      value={branchId}
                      onChange={(event) => {
                        const selectedBranchId = event.target.value;
                        const selectedBranch = branches.find(
                          (branch) => branch.id === selectedBranchId,
                        );
                        setBranchId(selectedBranchId);
                        if (selectedBranch) {
                          setTenantId(selectedBranch.tenantId);
                        }
                      }}
                      required
                    >
                      <option value="">Select a branch</option>
                      {branches
                        .filter(
                          (branch) => !tenantId || branch.tenantId === tenantId,
                        )
                        .map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                            {!tenantId
                              ? ` — ${tenants.find((tenant) => tenant.id === branch.tenantId)?.displayName ?? "School"}`
                              : ""}
                          </option>
                        ))}
                    </select>
                  </label>
                )}
              </div>
            )}
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
                  {loading ? "…" : files.length}
                </span>
              </h2>
              <p>Manage platform-wide and school-specific files.</p>
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
                    files.length ? "No matching resources" : "No resources yet"
                  }
                  description={
                    files.length
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title="Rename resource"
                          aria-label={`Rename ${item.originalName}`}
                          onClick={() => {
                            setEditName(item.originalName);
                            setEditingFile(item);
                          }}
                        >
                          <Pencil />
                        </Button>
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

      <Modal
        isOpen={editingFile !== null}
        onClose={() => setEditingFile(null)}
        title="Rename resource"
        description="Change the name shown in the resource library and download."
      >
        <form onSubmit={handleRename}>
          <ModalBody>
            <label className={styles.formField}>
              <span>Resource name</span>
              <input
                autoFocus
                required
                maxLength={255}
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </label>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingFile(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !editName.trim()}>
              {saving ? "Saving…" : "Save name"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
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
