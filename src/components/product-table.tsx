import { ArrowUpDown } from "lucide-react";
import { ColorDots } from "@/components/color-dots";
import { STATUS_META } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { useVault } from "@/lib/store";
import type { Product, SortKey } from "@/lib/types";

const COLS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Product" },
  { key: "brand", label: "Brand" },
  { key: "newest", label: "Added" },
  { key: "price-asc", label: "Price" },
];

export function ProductTable({
  items,
  onOpen,
}: {
  items: Product[];
  onOpen: (item: Product) => void;
}) {
  const sort = useVault((s) => s.sort);
  const setSort = useVault((s) => s.setSort);

  return (
    <div className="overflow-x-auto rounded-xl bg-surface hairline">
      <table className="w-full min-w-table text-left text-sm">
        <thead>
          <tr className="border-b border-border text-2xs uppercase tracking-caps text-muted">
            {COLS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-fg"
                  onClick={() =>
                    setSort(
                      col.key === "price-asc" && sort === "price-asc"
                        ? "price-desc"
                        : col.key,
                    )
                  }
                >
                  {col.label}
                  <ArrowUpDown className="size-3 opacity-50" />
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Colors</th>
            <th className="px-4 py-3 font-medium">Site</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-elevated/50"
              onClick={() => onOpen(item)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="size-10 shrink-0 overflow-hidden rounded-sm bg-elevated">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="size-full object-cover" />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{item.name}</p>
                    <p className="text-xs text-subtle">{item.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">{item.brand || "—"}</td>
              <td className="px-4 py-3 text-muted tabular-nums">
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </td>
              <td className="px-4 py-3 tabular-nums text-fg">
                {formatMoney(item.price, item.currency)}
              </td>
              <td className="px-4 py-3">
                <ColorDots colors={item.colors} />
              </td>
              <td className="px-4 py-3 text-muted">{item.website || "—"}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-elevated px-2 py-0.5 text-2xs text-muted">
                  {STATUS_META[item.status].label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
