import { COLOR_SWATCHES } from "@/lib/constants";
import { swatchHex } from "@/lib/format";
import { cn } from "@/lib/utils";

function fillFor(name: string): string {
  const hex = swatchHex(name);
  if (hex === "multi") {
    return "conic-gradient(from 40deg, #c45c4a, #c4a574, #7d9a7e, #3d6ea8, #c45c4a)";
  }
  if (hex) return hex;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 18% 48%)`;
}

export function ColorDots({
  colors,
  size = "sm",
}: {
  colors: string[];
  size?: "sm" | "md";
}) {
  if (colors.length === 0) return null;
  const dim = size === "md" ? "size-4" : "size-3";
  return (
    <span className="inline-flex items-center">
      {colors.slice(0, 5).map((c, i) => (
        <span
          key={`${c}-${i}`}
          title={c}
          className={cn(
            dim,
            "rounded-full ring-2 ring-surface",
            i > 0 && "-ml-1",
          )}
          style={{ background: fillFor(c) }}
        />
      ))}
    </span>
  );
}

export function ColorPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (name: string) => {
    onChange(
      value.includes(name) ? value.filter((c) => c !== name) : [...value, name],
    );
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_SWATCHES.map((c) => {
        const on = value.includes(c.name);
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => toggle(c.name)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-full px-2.5 text-xs tap-press",
              on ? "bg-accent text-accent-fg" : "bg-elevated text-muted hairline",
            )}
          >
            <span
              className="size-3 rounded-full"
              style={{ background: c.hex === "multi" ? fillFor("Multi") : c.hex }}
            />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
