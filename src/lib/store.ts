import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SAMPLE_ITEMS } from "./constants";
import type {
  Product,
  ProductDraft,
  SheetConnection,
  SortKey,
  StatusFilter,
  ViewMode,
} from "./types";
import { uid } from "./utils";

type VaultState = {
  items: Product[];
  hasSeeded: boolean;
  connection: SheetConnection;
  query: string;
  category: string;
  sort: SortKey;
  view: ViewMode;
  statusFilter: StatusFilter;
  setQuery: (q: string) => void;
  setCategory: (c: string) => void;
  setSort: (s: SortKey) => void;
  setView: (v: ViewMode) => void;
  setStatusFilter: (s: StatusFilter) => void;
  seedIfNeeded: () => void;
  clearSamples: () => void;
  upsertItem: (draft: ProductDraft) => Product;
  removeItem: (id: string) => void;
  replaceAll: (items: Product[]) => void;
  mergeFromSheet: (incoming: Product[]) => { added: number; updated: number };
  setConnection: (patch: Partial<SheetConnection>) => void;
};

const emptyConnection: SheetConnection = {
  webhookUrl: "",
  sheetUrl: "",
  autoSync: true,
  lastSyncedAt: null,
  lastError: null,
};

function normalizeDraft(draft: ProductDraft, existing?: Product): Product {
  const now = new Date().toISOString();
  return {
    id: draft.id || existing?.id || uid(),
    name: draft.name.trim() || "Untitled",
    url: draft.url.trim(),
    imageUrl: draft.imageUrl.trim(),
    category: draft.category.trim() || "Other",
    price: draft.price,
    targetPrice: draft.targetPrice,
    currency: draft.currency || "INR",
    colors: draft.colors.map((c) => c.trim()).filter(Boolean),
    brand: draft.brand.trim(),
    website: draft.website.trim(),
    notes: draft.notes.trim(),
    status: draft.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    sample: false,
  };
}

export const useVault = create<VaultState>()(
  persist(
    (set, get) => ({
      items: SAMPLE_ITEMS,
      hasSeeded: true,
      connection: emptyConnection,
      query: "",
      category: "All",
      sort: "newest",
      view: "gallery",
      statusFilter: "active",
      setQuery: (q) => set({ query: q }),
      setCategory: (c) => set({ category: c }),
      setSort: (s) => set({ sort: s }),
      setView: (v) => set({ view: v }),
      setStatusFilter: (s) => set({ statusFilter: s }),
      seedIfNeeded: () => {
        const { hasSeeded, items } = get();
        if (hasSeeded) return;
        if (items.length > 0) {
          set({ hasSeeded: true });
          return;
        }
        set({ items: SAMPLE_ITEMS, hasSeeded: true });
      },
      clearSamples: () =>
        set({ items: get().items.filter((i) => !i.sample), hasSeeded: true }),
      upsertItem: (draft) => {
        const existing = draft.id
          ? get().items.find((i) => i.id === draft.id)
          : undefined;
        const next = normalizeDraft(draft, existing);
        set({
          items: existing
            ? get().items.map((i) => (i.id === next.id ? next : i))
            : [next, ...get().items.filter((i) => i.id !== next.id)],
        });
        return next;
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      replaceAll: (items) => set({ items, hasSeeded: true }),
      mergeFromSheet: (incoming) => {
        const byId = new Map(get().items.map((i) => [i.id, i]));
        const byUrl = new Map(
          get()
            .items.filter((i) => i.url)
            .map((i) => [i.url, i]),
        );
        let added = 0;
        let updated = 0;
        const next = [...get().items];
        for (const item of incoming) {
          const hit =
            byId.get(item.id) ?? (item.url ? byUrl.get(item.url) : undefined);
          if (hit) {
            const merged: Product = {
              ...hit,
              ...item,
              id: hit.id,
              createdAt: hit.createdAt,
              updatedAt: new Date().toISOString(),
              sample: false,
            };
            const idx = next.findIndex((i) => i.id === hit.id);
            if (idx >= 0) next[idx] = merged;
            updated += 1;
          } else {
            next.unshift({ ...item, sample: false });
            added += 1;
          }
        }
        set({ items: next, hasSeeded: true });
        return { added, updated };
      },
      setConnection: (patch) =>
        set({ connection: { ...get().connection, ...patch } }),
    }),
    {
      name: "vitrine-vault-v2",
      partialize: (s) => ({
        items: s.items,
        hasSeeded: s.hasSeeded,
        connection: s.connection,
        view: s.view,
        sort: s.sort,
      }),
    },
  ),
);

export function visibleItems(
  items: Product[],
  query: string,
  category: string,
  sort: SortKey,
  statusFilter: StatusFilter,
): Product[] {
  const q = query.trim().toLowerCase();
  let list = items;
  if (statusFilter === "active") {
    list = list.filter((i) => i.status !== "bought" && i.status !== "passed");
  } else if (statusFilter === "bought") {
    list = list.filter((i) => i.status === "bought");
  }
  if (category !== "All") {
    list = list.filter((i) => i.category === category);
  }
  if (q) {
    list = list.filter((i) => {
      const hay = [i.name, i.brand, i.website, i.category, i.notes, ...i.colors]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "brand":
      sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  return sorted;
}
