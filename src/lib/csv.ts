import { SHEET_HEADERS } from "./constants";
import type { Product, Status } from "./types";
import { uid } from "./utils";

const STATUS_SET = new Set<Status>([
  "watching",
  "sale",
  "budget",
  "bought",
  "passed",
]);

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

function colIndex(headers: string[], aliases: string[]): number {
  const normalized = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, ""));
  for (const alias of aliases) {
    const i = normalized.indexOf(alias);
    if (i >= 0) return i;
  }
  return -1;
}

function cell(row: string[], i: number): string {
  if (i < 0) return "";
  return row[i] ?? "";
}

function toStatus(raw: string): Status {
  const v = raw.toLowerCase().trim();
  if (STATUS_SET.has(v as Status)) return v as Status;
  if (v.includes("sale") || v.includes("cheap")) return "sale";
  if (v.includes("budget") || v.includes("money") || v.includes("later")) return "budget";
  if (v.includes("bought") || v.includes("purchased") || v.includes("owned")) return "bought";
  if (v.includes("pass") || v.includes("skip") || v.includes("drop")) return "passed";
  return "watching";
}

function toNumber(raw: string): number | null {
  const n = Number(String(raw).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && raw.trim() !== "" ? n : null;
}

export function rowsToProducts(rows: string[][]): Product[] {
  if (rows.length === 0) return [];
  const headers = rows[0]!.map((h) => h.trim());
  const idx = {
    id: colIndex(headers, ["id", "uuid"]),
    name: colIndex(headers, ["name", "title", "product", "item", "productname"]),
    url: colIndex(headers, ["link", "url", "href", "producturl", "productlink"]),
    category: colIndex(headers, ["category", "cat", "type", "section"]),
    price: colIndex(headers, ["price", "cost", "mrp", "amount", "currentprice"]),
    target: colIndex(headers, ["target", "targetprice", "wantprice", "saleprice"]),
    currency: colIndex(headers, ["currency", "curr"]),
    colors: colIndex(headers, ["colors", "colour", "colours", "color"]),
    brand: colIndex(headers, ["brand", "maker", "label"]),
    website: colIndex(headers, ["website", "site", "store", "source", "shop"]),
    status: colIndex(headers, ["status", "state"]),
    notes: colIndex(headers, ["notes", "note", "comment", "remarks"]),
    image: colIndex(headers, ["image", "imageurl", "img", "photo"]),
    added: colIndex(headers, ["added", "created", "date", "createdat"]),
  };

  const hasHeader =
    idx.name >= 0 || idx.url >= 0 || headers.some((h) => /name|link|price|brand/i.test(h));
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const now = new Date().toISOString();

  return dataRows
    .map((row) => {
      const name = cell(row, idx.name) || cell(row, 0);
      const url = cell(row, idx.url);
      if (!name && !url) return null;
      const createdAt = cell(row, idx.added) || now;
      const product: Product = {
        id: cell(row, idx.id) || uid(),
        name: name || "Untitled",
        url,
        imageUrl: cell(row, idx.image),
        category: cell(row, idx.category) || "Other",
        price: toNumber(cell(row, idx.price)),
        targetPrice: toNumber(cell(row, idx.target)),
        currency: cell(row, idx.currency) || "INR",
        colors: cell(row, idx.colors)
          .split(/[,|/]/)
          .map((c) => c.trim())
          .filter(Boolean),
        brand: cell(row, idx.brand),
        website: cell(row, idx.website),
        notes: cell(row, idx.notes),
        status: toStatus(cell(row, idx.status)),
        createdAt,
        updatedAt: now,
      };
      return product;
    })
    .filter((p): p is Product => p !== null);
}

function csvEscape(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function productsToCsv(items: Product[]): string {
  const header = SHEET_HEADERS.join(",");
  const lines = items.map((p) =>
    [
      p.id,
      p.name,
      p.url,
      p.category,
      p.price ?? "",
      p.targetPrice ?? "",
      p.currency,
      p.colors.join(", "),
      p.brand,
      p.website,
      p.status,
      p.notes,
      p.imageUrl,
      p.createdAt,
    ]
      .map(csvEscape)
      .join(","),
  );
  return [header, ...lines].join("\n");
}

export function extractSheetId(raw: string): string | null {
  const trimmed = raw.trim();
  const fromPath = trimmed.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (fromPath?.[1]) return fromPath[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return trimmed;
  return null;
}
