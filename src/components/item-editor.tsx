import { ExternalLink, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/components/color-dots";
import { Overlay } from "@/components/overlay";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { CATEGORIES, STATUS_META } from "@/lib/constants";
import { parsePrice } from "@/lib/format";
import type { ProductDraft, Status } from "@/lib/types";
import { cn, hostnameFromUrl, prettySiteName, safeHttpUrl } from "@/lib/utils";

const STATUSES = Object.entries(STATUS_META) as [
  Status,
  (typeof STATUS_META)[Status],
][];

function emptyDraft(): ProductDraft {
  return {
    name: "",
    url: "",
    imageUrl: "",
    category: "Fashion",
    price: null,
    targetPrice: null,
    currency: "INR",
    colors: [],
    brand: "",
    website: "",
    notes: "",
    status: "watching",
  };
}

export function ItemEditor({
  open,
  seed,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  seed: ProductDraft | null;
  onClose: () => void;
  onSave: (draft: ProductDraft) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());
  const [priceText, setPriceText] = useState("");
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    if (!open) return;
    const next = seed ?? emptyDraft();
    setDraft(next);
    setPriceText(next.price === null ? "" : String(next.price));
    setTargetText(next.targetPrice === null ? "" : String(next.targetPrice));
  }, [open, seed]);

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function handleUrlBlur() {
    const url = safeHttpUrl(draft.url);
    if (!url) return;
    set("url", url);
    if (!draft.website) set("website", prettySiteName(hostnameFromUrl(url)));
  }

  function save() {
    onSave({
      ...draft,
      price: parsePrice(priceText),
      targetPrice: parsePrice(targetText),
    });
  }

  return (
    <Overlay open={open} onClose={onClose} labelledBy="editor-title">
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-2xs uppercase tracking-caps text-muted">
              {draft.id ? "Edit piece" : "Keep this"}
            </p>
            <h2 id="editor-title" className="mt-1 font-display text-3xl italic leading-tight">
              {draft.name || "New save"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {draft.imageUrl ? (
          <div className="mb-6 overflow-hidden rounded-lg bg-elevated">
            <img src={draft.imageUrl} alt="" className="max-h-56 w-full object-cover" />
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Link" className="sm:col-span-2">
            <Input
              value={draft.url}
              onChange={(e) => set("url", e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://"
            />
          </Field>
          <Field label="Brand">
            <Input value={draft.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Website">
            <Input
              value={draft.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="Myntra, Amazon…"
            />
          </Field>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-11 w-full rounded-md bg-elevated px-3 text-sm hairline outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Image URL">
            <Input
              value={draft.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="Optional"
            />
          </Field>
          <Field label="Price (₹)">
            <Input
              inputMode="decimal"
              value={priceText}
              onChange={(e) => setPriceText(e.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Buy when at (₹)" hint="Highlight when the listing hits this">
            <Input
              inputMode="decimal"
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              placeholder="Optional"
            />
          </Field>
          <Field label="Status" className="sm:col-span-2">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(([id, meta]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("status", id)}
                  className={cn(
                    "h-9 rounded-full px-3 text-xs tap-press",
                    draft.status === id
                      ? "bg-accent text-accent-fg"
                      : "bg-elevated text-muted hairline",
                  )}
                >
                  {meta.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Colors" className="sm:col-span-2">
            <ColorPicker value={draft.colors} onChange={(colors) => set("colors", colors)} />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <Textarea
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Size, why you want it, when to buy…"
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Button type="button" onClick={save}>
            Save to list
          </Button>
          {draft.url ? (
            <Button variant="secondary" asChild>
              <a href={draft.url} target="_blank" rel="noreferrer">
                Open listing
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          ) : null}
          <div className="flex-1" />
          {draft.id && onDelete ? (
            <Button type="button" variant="danger" onClick={() => onDelete(draft.id!)}>
              <Trash2 className="size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </Overlay>
  );
}
