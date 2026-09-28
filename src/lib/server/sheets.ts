import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractSheetId, parseCsv, rowsToProducts } from "../csv";
import type { Product } from "../types";

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  price: z.number().nullable(),
  targetPrice: z.number().nullable(),
  currency: z.string(),
  colors: z.array(z.string()),
  brand: z.string(),
  website: z.string(),
  notes: z.string(),
  status: z.enum(["watching", "sale", "budget", "bought", "passed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  sample: z.boolean().optional(),
});

const webhookSchema = z.string().min(12);

function looksLikeJson(text: string): boolean {
  const t = text.trim();
  return t.startsWith("{") || t.startsWith("[");
}

async function callWebhook(
  webhookUrl: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; data: unknown; error?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(webhookUrl);
  } catch {
    return { ok: false, data: null, error: "That webhook URL isn't valid." };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, data: null, error: "Webhook must be an http(s) URL." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const res = await fetch(parsed.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
      signal: controller.signal,
    });
    const text = await res.text();
    if (looksLikeJson(text)) {
      const json: unknown = JSON.parse(text);
      return { ok: true, data: json };
    }
    if (text.includes("<html") || text.includes("<HTML")) {
      return {
        ok: false,
        data: null,
        error:
          "Google returned a login page. Deploy the script as a Web app with access set to Anyone.",
      };
    }
    if (!res.ok) {
      return { ok: false, data: null, error: `Sheet webhook responded ${res.status}.` };
    }
    return { ok: false, data: null, error: "Unexpected response from the sheet webhook." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not reach the webhook.";
    return { ok: false, data: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

function itemsFromData(data: unknown): Product[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as { items?: unknown; ok?: unknown };
  if (!Array.isArray(obj.items)) return [];
  const out: Product[] = [];
  for (const raw of obj.items) {
    const parsed = productSchema.partial().safeParse(raw);
    if (!parsed.success) continue;
    const p = parsed.data;
    if (!p.id && !p.name) continue;
    out.push({
      id: p.id || crypto.randomUUID(),
      name: p.name || "Untitled",
      url: p.url || "",
      imageUrl: p.imageUrl || "",
      category: p.category || "Other",
      price: p.price ?? null,
      targetPrice: p.targetPrice ?? null,
      currency: p.currency || "INR",
      colors: p.colors || [],
      brand: p.brand || "",
      website: p.website || "",
      notes: p.notes || "",
      status: p.status || "watching",
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
    });
  }
  return out;
}

export const pingSheet = createServerFn({ method: "POST" })
  .validator(z.object({ webhookUrl: webhookSchema }))
  .handler(async ({ data }) => {
    const result = await callWebhook(data.webhookUrl, { action: "ping" });
    if (!result.ok) return { ok: false as const, error: result.error ?? "Ping failed." };
    const payload = result.data as { ok?: boolean; title?: string; error?: string };
    if (payload && payload.ok === false) {
      return { ok: false as const, error: payload.error ?? "Webhook error." };
    }
    return {
      ok: true as const,
      title: typeof payload?.title === "string" ? payload.title : "Google Sheet",
    };
  });

export const pullSheet = createServerFn({ method: "POST" })
  .validator(z.object({ webhookUrl: webhookSchema }))
  .handler(async ({ data }) => {
    const result = await callWebhook(data.webhookUrl, { action: "list" });
    if (!result.ok) return { ok: false as const, error: result.error ?? "Pull failed." };
    return { ok: true as const, items: itemsFromData(result.data) };
  });

export const pushAllToSheet = createServerFn({ method: "POST" })
  .validator(
    z.object({
      webhookUrl: webhookSchema,
      items: z.array(productSchema),
    }),
  )
  .handler(async ({ data }) => {
    const result = await callWebhook(data.webhookUrl, {
      action: "replaceAll",
      items: data.items.map(({ sample: _s, ...rest }) => rest),
    });
    if (!result.ok) return { ok: false as const, error: result.error ?? "Push failed." };
    return { ok: true as const };
  });

export const upsertSheetItem = createServerFn({ method: "POST" })
  .validator(
    z.object({
      webhookUrl: webhookSchema,
      item: productSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { sample: _s, ...item } = data.item;
    const result = await callWebhook(data.webhookUrl, { action: "upsert", item });
    if (!result.ok) return { ok: false as const, error: result.error ?? "Sync failed." };
    return { ok: true as const };
  });

export const deleteSheetItem = createServerFn({ method: "POST" })
  .validator(
    z.object({
      webhookUrl: webhookSchema,
      id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const result = await callWebhook(data.webhookUrl, { action: "delete", id: data.id });
    if (!result.ok) return { ok: false as const, error: result.error ?? "Delete failed." };
    return { ok: true as const };
  });

export const importPublishedSheet = createServerFn({ method: "POST" })
  .validator(z.object({ sheetUrl: z.string().min(8) }))
  .handler(async ({ data }) => {
    const id = extractSheetId(data.sheetUrl);
    if (!id) return { ok: false as const, error: "Could not read a Sheet ID from that link." };

    const urls = [
      `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
      `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`,
    ];

    let lastError = "Could not download the sheet.";
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          redirect: "follow",
          headers: { accept: "text/csv,text/plain" },
        });
        const text = await res.text();
        if (!res.ok || text.includes("<html") || text.includes("<HTML")) {
          lastError =
            "The sheet is not public. Use File → Share → Anyone with the link, or Publish to web.";
          continue;
        }
        const rows = parseCsv(text);
        const items = rowsToProducts(rows);
        return { ok: true as const, items, count: items.length };
      } catch (err) {
        lastError = err instanceof Error ? err.message : lastError;
      }
    }
    return { ok: false as const, error: lastError };
  });
