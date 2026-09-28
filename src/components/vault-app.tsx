import { Sheet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Composer } from "@/components/composer";
import { ConnectPanel } from "@/components/connect-panel";
import { FilterBar } from "@/components/filter-bar";
import { ItemEditor } from "@/components/item-editor";
import { Mark } from "@/components/mark";
import { ProductCard } from "@/components/product-card";
import { ProductTable } from "@/components/product-table";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { useVault, visibleItems } from "@/lib/store";
import { syncDelete, syncUpsert } from "@/lib/sync";
import type { Product, ProductDraft } from "@/lib/types";

export function VaultApp() {
  const items = useVault((s) => s.items);
  const view = useVault((s) => s.view);
  const query = useVault((s) => s.query);
  const category = useVault((s) => s.category);
  const sort = useVault((s) => s.sort);
  const statusFilter = useVault((s) => s.statusFilter);
  const connection = useVault((s) => s.connection);
  const upsertItem = useVault((s) => s.upsertItem);
  const removeItem = useVault((s) => s.removeItem);
  const clearSamples = useVault((s) => s.clearSamples);

  const visible = useMemo(
    () => visibleItems(items, query, category, sort, statusFilter),
    [items, query, category, sort, statusFilter],
  );

  const [connectOpen, setConnectOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [seed, setSeed] = useState<ProductDraft | null>(null);

  const samples = items.some((i) => i.sample);
  const displayValue = items
    .filter((i) => i.status !== "bought" && i.status !== "passed")
    .reduce((sum, i) => sum + (i.price ?? 0), 0);

  function openNew(draft: ProductDraft) {
    setSeed(draft);
    setEditorOpen(true);
  }

  function openExisting(item: Product) {
    setSeed(item);
    setEditorOpen(true);
  }

  function handleSave(draft: ProductDraft) {
    const saved = upsertItem(draft);
    setEditorOpen(false);
    toast.success(draft.id ? "Updated" : "Saved to your list");
    void syncUpsert(saved);
  }

  function handleDelete(id: string) {
    removeItem(id);
    setEditorOpen(false);
    toast.message("Removed");
    void syncDelete(id);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_50%_-10%,color-mix(in_oklab,var(--color-fg)_6%,transparent),transparent_55%)]" />
      <header className="relative z-10 border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <Mark className="size-8 text-fg" />
          <div className="leading-none">
            <p className="font-display text-xl italic tracking-tight">Vitrine</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant={connection.webhookUrl ? "secondary" : "primary"}
              size="sm"
              onClick={() => setConnectOpen(true)}
            >
              <Sheet className="size-3.5" />
              <span className="hidden sm:inline">
                {connection.webhookUrl ? "Sheet linked" : "Link Google Sheet"}
              </span>
              <span className="sm:hidden">Sheet</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-10 sm:pt-14">
        <div className="stagger-in max-w-2xl">
          <p className="text-2xs uppercase tracking-caps text-muted">
            Window shop. Keep. Buy later.
          </p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight tracking-tight sm:text-5xl">
            A private shop window for everything you might buy.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Paste a link. We catch the name, price, brand and shop. Sort by
            color, category, or what you're waiting on — then send it to
            your Google Sheet in one motion.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <Composer onDraft={openNew} />
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-8">
          <div>
            <p className="text-2xs uppercase tracking-caps text-muted">On the list</p>
            <p className="mt-1 font-display text-3xl italic tabular-nums">
              {visible.length}
              <span className="ml-3 text-lg not-italic text-muted">
                {formatMoney(displayValue)}
              </span>
            </p>
          </div>
          {samples ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearSamples}>
              Clear example pieces
            </Button>
          ) : null}
        </div>

        <div className="mt-8">
          <FilterBar />
        </div>

        {visible.length === 0 ? (
          <div className="mt-16 max-w-md">
            <p className="font-display text-2xl italic">Nothing here yet.</p>
            <p className="mt-2 text-sm text-muted">
              Paste a Myntra, Amazon, or any product URL above. It will live on
              this device until you link a sheet — then it follows you.
            </p>
          </div>
        ) : view === "table" ? (
          <div className="mt-8">
            <ProductTable items={visible} onOpen={openExisting} />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, i) => (
              <ProductCard
                key={item.id}
                item={item}
                index={i}
                onOpen={openExisting}
              />
            ))}
          </div>
        )}
      </main>

      <ItemEditor
        open={editorOpen}
        seed={seed}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <ConnectPanel open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  );
}
