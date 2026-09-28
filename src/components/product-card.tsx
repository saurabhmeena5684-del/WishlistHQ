import { ArrowUpRight } from "lucide-react";
import { ColorDots } from "@/components/color-dots";
import { STATUS_META } from "@/lib/constants";
import { formatMoney, initials } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  item,
  index,
  onOpen,
}: {
  item: Product;
  index: number;
  onOpen: (item: Product) => void;
}) {
  const ready =
    item.targetPrice !== null &&
    item.price !== null &&
    item.price <= item.targetPrice;
  const meta = STATUS_META[item.status];

  return (
    <article
      className="group card-enter"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex w-full flex-col text-left"
      >
        <div className="relative aspect-portrait overflow-hidden rounded-lg bg-elevated">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="size-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-elevated">
              <span className="font-display text-3xl italic text-subtle">
                {initials(item.brand || item.name)}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent opacity-80" />
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-3xs font-medium uppercase tracking-caps",
              "bg-bg/70 text-fg backdrop-blur-sm",
            )}
          >
            {item.category}
          </span>
          {ready ? (
            <span className="absolute right-3 top-3 rounded-full bg-good/90 px-2.5 py-1 text-3xs font-medium uppercase tracking-caps text-bg">
              At target
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5 px-1 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xs uppercase tracking-caps text-muted">
                {item.brand || item.website || "Saved"}
              </p>
              <h3 className="mt-0.5 truncate font-display text-lg italic leading-snug text-fg">
                {item.name}
              </h3>
            </div>
            <ColorDots colors={item.colors} />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="tabular-nums text-sm text-fg">
              {formatMoney(item.price, item.currency)}
              {item.targetPrice !== null ? (
                <span className="ml-2 text-xs text-muted">
                  want {formatMoney(item.targetPrice, item.currency)}
                </span>
              ) : null}
            </p>
            <p className="text-2xs text-subtle">{meta.label}</p>
          </div>
        </div>
      </button>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex h-9 items-center gap-1 rounded-sm px-1 text-xs text-muted hover:text-fg"
        >
          {item.website || "Open listing"}
          <ArrowUpRight className="size-3.5" />
        </a>
      ) : null}
    </article>
  );
}
