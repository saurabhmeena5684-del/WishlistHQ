import { Link2, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchProductFromUrl } from "@/lib/server/fetch-product";
import type { ProductDraft } from "@/lib/types";
import { hostnameFromUrl, prettySiteName, safeHttpUrl } from "@/lib/utils";

export function Composer({
  onDraft,
}: {
  onDraft: (draft: ProductDraft) => void;
}) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(raw: string) {
    const url = safeHttpUrl(raw);
    if (!url) {
      onDraft({
        name: raw.trim() || "Untitled",
        url: "",
        imageUrl: "",
        category: "Other",
        price: null,
        targetPrice: null,
        currency: "INR",
        colors: [],
        brand: "",
        website: "",
        notes: "",
        status: "watching",
      });
      setValue("");
      return;
    }
    setBusy(true);
    const host = hostnameFromUrl(url);
    try {
      const result = await fetchProductFromUrl({ data: { url } });
      if (result.ok) {
        onDraft({
          name: result.product.name,
          url,
          imageUrl: result.product.imageUrl,
          category: "Other",
          price: result.product.price,
          targetPrice: null,
          currency: result.product.currency || "INR",
          colors: result.product.colors,
          brand: result.product.brand,
          website: result.product.website || prettySiteName(host),
          notes: result.product.description,
          status: "watching",
        });
      } else {
        toast.message("Couldn't auto-fill", { description: result.error });
        onDraft({
          name: prettySiteName(host) || "Saved link",
          url,
          imageUrl: "",
          category: "Other",
          price: null,
          targetPrice: null,
          currency: "INR",
          colors: [],
          brand: "",
          website: prettySiteName(host),
          notes: "",
          status: "watching",
        });
      }
      setValue("");
    } catch {
      toast.error("Something went wrong fetching that page.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(value);
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste a product link to keep it"
            className="h-14 w-full rounded-lg bg-surface pl-11 pr-4 text-base text-fg outline-none placeholder:text-subtle hairline focus:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
            autoComplete="off"
            enterKeyHint="go"
          />
          {busy ? (
            <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left bg-accent fetch-line" />
          ) : null}
        </div>
        <Button type="submit" size="lg" className="h-14 min-w-32 sm:w-auto" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {busy ? "Reading" : "Save"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-subtle">
        Title, image, price and brand fill in when the listing allows it. You can always edit.
      </p>
    </form>
  );
}
