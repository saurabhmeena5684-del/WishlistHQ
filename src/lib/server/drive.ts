import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  classifyCallToolError,
  ConnectorType,
  GoogleDriveTools,
  isConnectorPending,
  isLoginRequired,
} from "@/lib/app-data";
import { parseCsv, rowsToProducts } from "../csv";
import type { Product } from "../types";

export type DriveFile = {
  id: string;
  name: string;
  modifiedTime?: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function extractFiles(data: unknown): DriveFile[] {
  const buckets: unknown[] = [];
  if (Array.isArray(data)) buckets.push(...data);
  const rec = asRecord(data);
  if (rec) {
    for (const key of ["files", "items", "results", "documents"]) {
      if (Array.isArray(rec[key])) buckets.push(...(rec[key] as unknown[]));
    }
    if (typeof rec.id === "string") buckets.push(rec);
  }
  const out: DriveFile[] = [];
  for (const item of buckets) {
    const r = asRecord(item);
    if (!r) continue;
    const id = typeof r.id === "string" ? r.id : typeof r.file_id === "string" ? r.file_id : "";
    const name =
      typeof r.name === "string" ? r.name : typeof r.title === "string" ? r.title : "";
    if (!id || !name) continue;
    out.push({
      id,
      name,
      modifiedTime:
        typeof r.modifiedTime === "string"
          ? r.modifiedTime
          : typeof r.modified_time === "string"
            ? r.modified_time
            : undefined,
    });
  }
  return out;
}

function extractText(data: unknown): string {
  if (typeof data === "string") return data;
  const rec = asRecord(data);
  if (!rec) return "";
  for (const key of ["content", "text", "data", "body", "csv"]) {
    if (typeof rec[key] === "string") return rec[key] as string;
  }
  if (Array.isArray(rec.rows)) {
    return (rec.rows as unknown[])
      .map((row) => (Array.isArray(row) ? row.join(",") : String(row)))
      .join("\n");
  }
  try {
    return JSON.stringify(data);
  } catch {
    return "";
  }
}

export const listDriveSheets = createServerFn({ method: "POST" }).handler(async () => {
  const { callTool } = await import("@/lib/app-data/client.server");
  const result = await callTool(
    GoogleDriveTools.search,
    {
      query: "mimeType:'application/vnd.google-apps.spreadsheet' OR mimeType:'text/csv'",
    },
    { connectorType: ConnectorType.GoogleDrive },
  );

  if (isConnectorPending(result)) {
    return { ok: false as const, pending: true as const, error: "Connecting to Google Drive…" };
  }
  if (isLoginRequired(result)) {
    return {
      ok: false as const,
      loginRequired: true as const,
      loginUrl: result.loginUrl,
      error: "Continue with Grok to load your Drive.",
    };
  }
  if (!result.ok) {
    const classified = classifyCallToolError(result);
    return {
      ok: false as const,
      error: classified?.message ?? result.errorMessage ?? "Could not search Drive.",
      kind: classified?.kind,
    };
  }
  return { ok: true as const, files: extractFiles(result.data) };
});

export const importDriveSheet = createServerFn({ method: "POST" })
  .validator(z.object({ fileId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { callTool } = await import("@/lib/app-data/client.server");
    const result = await callTool(
      GoogleDriveTools.readFile,
      { file_id: data.fileId, id: data.fileId },
      { connectorType: ConnectorType.GoogleDrive },
    );

    if (isConnectorPending(result)) {
      return { ok: false as const, pending: true as const, error: "Connecting to Google Drive…" };
    }
    if (isLoginRequired(result)) {
      return {
        ok: false as const,
        loginRequired: true as const,
        loginUrl: result.loginUrl,
        error: "Continue with Grok to load your Drive.",
      };
    }
    if (!result.ok) {
      const classified = classifyCallToolError(result);
      return {
        ok: false as const,
        error: classified?.message ?? result.errorMessage ?? "Could not read that file.",
      };
    }

    const text = extractText(result.data);
    if (!text) {
      return { ok: false as const, error: "That file didn't contain readable rows." };
    }
    let items: Product[] = [];
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      try {
        const json: unknown = JSON.parse(text);
        const rec = asRecord(json);
        const maybeRows = Array.isArray(json) ? json : rec?.values ?? rec?.rows;
        if (Array.isArray(maybeRows) && maybeRows.every((r) => Array.isArray(r))) {
          items = rowsToProducts(maybeRows as string[][]);
        }
      } catch {
        items = rowsToProducts(parseCsv(text));
      }
    } else {
      items = rowsToProducts(parseCsv(text));
    }
    return { ok: true as const, items, count: items.length };
  });
