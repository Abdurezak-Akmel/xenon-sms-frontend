import { apiFetch } from "../../lib/api";
import {
  getAuthenticatedBranchId,
  getAuthenticatedTenantId,
} from "../auth/user.service";

const FILE_OBJECTS_ENDPOINT = "/file-objects";

export type FileVisibility = "private" | "tenant" | "branch" | "public";

export type FileObject = {
  id: string;
  tenantId: string | null;
  branchId: string | null;
  ownerUserId: string | null;
  storageProvider: string;
  objectKey: string;
  originalName: string;
  mimeType: string | null;
  sizeBytes: number;
  checksumSha256: string | null;
  visibility: FileVisibility;
  accessPolicy: Record<string, unknown>;
  uploadedAt: string;
  deletedAt: string | null;
};

export type FileObjectListResponse = {
  fileObjects: FileObject[];
};

export type FileObjectResponse = {
  message?: string;
  fileObject: FileObject;
};

export type UploadFileObjectResponse = FileObjectResponse & {
  downloadUrl: string;
};

function createFileUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

export async function uploadGlobalFileObject(file: File) {
  return apiFetch<UploadFileObjectResponse>(`${FILE_OBJECTS_ENDPOINT}/global`, {
    method: "POST",
    body: createFileUpload(file),
  });
}

export async function uploadTenantFileObject(tenantId: string, file: File) {
  return apiFetch<UploadFileObjectResponse>(
    `${FILE_OBJECTS_ENDPOINT}/tenant/${encodeURIComponent(tenantId)}`,
    {
      method: "POST",
      body: createFileUpload(file),
    },
  );
}

export async function uploadBranchFileObject(
  tenantId: string,
  branchId: string,
  file: File,
) {
  return apiFetch<UploadFileObjectResponse>(
    `${FILE_OBJECTS_ENDPOINT}/branch/${encodeURIComponent(tenantId)}/${encodeURIComponent(branchId)}`,
    {
      method: "POST",
      body: createFileUpload(file),
    },
  );
}

export async function uploadCurrentBranchFileObject(file: File) {
  return uploadBranchFileObject(
    getAuthenticatedTenantId(),
    getAuthenticatedBranchId(),
    file,
  );
}

export async function listFileObjects() {
  return apiFetch<FileObjectListResponse>(FILE_OBJECTS_ENDPOINT);
}

export async function getFileObject(id: string) {
  return apiFetch<FileObjectResponse>(
    `${FILE_OBJECTS_ENDPOINT}/${encodeURIComponent(id)}`,
  );
}

export async function updateFileObject(
  id: string,
  input: { originalName: string },
) {
  return apiFetch<FileObjectResponse>(
    `${FILE_OBJECTS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function downloadFileObject(id: string) {
  return apiFetch<Blob>(
    `${FILE_OBJECTS_ENDPOINT}/${encodeURIComponent(id)}/download`,
    { responseType: "blob" },
  );
}

export async function deleteFileObject(id: string) {
  return apiFetch<FileObjectResponse>(
    `${FILE_OBJECTS_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
