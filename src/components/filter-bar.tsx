import { LayoutGrid, List, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { useVault } from "@/lib/store";
import type { SortKey, StatusFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES: { id: StatusFilter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "bought", label: "Bought" },
  { id: "all", label: "All" },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
  { id: "brand", label: "Brand" },
  { id: "name", label: "Name" },
];

export function FilterBar() {
  const query = useVault((s) => s.query);
  const setQuery = useVault((s) => s.setQuery);
  const category = useVault((s) => s.category);
  const setCategory = useVault((s) => s.setCategory);
  const sort = useVault((s) => s.sort);
  const setSort = useVault((s) => s.setSort);
  const view = useVault((s) => s.view);
  const setView = useVault((s) => s.setView);
  const statusFilter = useVault((s) => s.statusFilter);
  const setStatusFilter = useVault((s) => s.setStatusFilter);

  const cats = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStatusFilter(s.id)}
            className={cn(
              "h-9 rounded-full px-3.5 text-sm tap-press",
              statusFilter === s.id
                ? "bg-accent text-accent-fg"
                : "bg-surface text-muted hairline hover:text-fg",
            )}
          >
            {s.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 rounded-md bg-surface p-1 hairline">
          <button
            type="button"
            aria-label="Gallery view"
            onClick={() => setView("gallery")}
            className={cn(
              "flex size-9 items-center justify-center rounded-sm",
              view === "gallery" ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Table view"
            onClick={() => setView("table")}
            className={cn(
              "flex size-9 items-center justify-center rounded-sm",
              view === "table" ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, color…"
            className="h-11 w-full rounded-md bg-surface pl-10 pr-3 text-sm outline-none placeholder:text-subtle hairline"
          />
        </div>
        <label className="flex h-11 items-center gap-2 rounded-md bg-surface px-3 text-sm text-muted hairline">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent text-fg outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "h-8 shrink-0 rounded-full px-3 text-xs tap-press",
              category === c
                ? "bg-elevated text-fg hairline"
                : "text-muted hover:text-fg",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
