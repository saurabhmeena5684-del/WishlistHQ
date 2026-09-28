export const STATUSES = [
  "watching",
  "sale",
  "budget",
  "bought",
  "passed",
] as const;

export type Status = (typeof STATUSES)[number];

export type Product = {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  category: string;
  price: number | null;
  targetPrice: number | null;
  currency: string;
  colors: string[];
  brand: string;
  website: string;
  notes: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  sample?: boolean;
};

export type SheetConnection = {
  webhookUrl: string;
  sheetUrl: string;
  autoSync: boolean;
  lastSyncedAt: string | null;
  lastError: string | null;
};

export type ViewMode = "gallery" | "table";
export type SortKey = "newest" | "price-asc" | "price-desc" | "name" | "brand";
export type StatusFilter = "active" | "bought" | "all";

export type ProductDraft = Omit<Product, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
