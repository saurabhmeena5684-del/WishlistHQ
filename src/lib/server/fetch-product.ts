import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hostnameFromUrl, prettySiteName } from "../utils";

export type FetchedProduct = {
  name: string;
  imageUrl: string;
  price: number | null;
  currency: string;
  brand: string;
  website: string;
  colors: string[];
  description: string;
};

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.0\.0\.0|\[::1\]|metadata\.|.*\.local|.*\.internal)$/i;

function decodeEntities(s: string): string {
  return s
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\\u002F/g, "/")
    .replace(/\\u0026/g, "&");
}

function meta(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name|itemprop)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name|itemprop)=["']${escaped}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return null;
}

function absoluteUrl(maybe: string, pageUrl: string): string {
  try {
    return new URL(maybe, pageUrl).toString();
  } catch {
    return maybe;
  }
}

function parseJsonLd(html: string): Record<string, unknown> | null {
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  const nodes: unknown[] = [];
  while ((match = re.exec(html))) {
    try {
      const parsed: unknown = JSON.parse(match[1]!.trim());
      if (Array.isArray(parsed)) nodes.push(...parsed);
      else nodes.push(parsed);
    } catch {
      /* skip broken json-ld */
    }
  }
  const flatten = (n: unknown): Record<string, unknown>[] => {
    if (!n || typeof n !== "object") return [];
    const obj = n as Record<string, unknown>;
    const graph = obj["@graph"];
    if (Array.isArray(graph)) return graph.flatMap(flatten);
    return [obj];
  };
  const all = nodes.flatMap(flatten);
  return (
    all.find((n) => {
      const t = n["@type"];
      const types = Array.isArray(t) ? t : [t];
      return types.some((x) => typeof x === "string" && /product/i.test(x));
    }) ?? null
  );
}

function readOffer(product: Record<string, unknown>): {
  price: number | null;
  currency: string;
} {
  const offers = product.offers;
  const offer = Array.isArray(offers) ? offers[0] : offers;
  if (!offer || typeof offer !== "object") return { price: null, currency: "INR" };
  const o = offer as Record<string, unknown>;
  const raw = o.price ?? o.lowPrice;
  const price =
    typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : null;
  const currency = typeof o.priceCurrency === "string" ? o.priceCurrency : "INR";
  return {
    price: price !== null && Number.isFinite(price) ? price : null,
    currency,
  };
}

function asString(v: unknown): string {
  if (typeof v === "string") return v;
  if (
    v &&
    typeof v === "object" &&
    "name" in v &&
    typeof (v as { name: unknown }).name === "string"
  ) {
    return (v as { name: string }).name;
  }
  return "";
}

function asImage(v: unknown, pageUrl: string): string {
  if (typeof v === "string") return absoluteUrl(v, pageUrl);
  if (Array.isArray(v) && v.length) return asImage(v[0], pageUrl);
  if (v && typeof v === "object" && "url" in v) {
    return asImage((v as { url: unknown }).url, pageUrl);
  }
  return "";
}

export const fetchProductFromUrl = createServerFn({ method: "POST" })
  .validator(z.object({ url: z.string().min(4) }))
  .handler(async ({ data }): Promise<
    { ok: true; product: FetchedProduct } | { ok: false; error: string }
  > => {
    let url: URL;
    try {
      url = new URL(data.url);
    } catch {
      return { ok: false, error: "That doesn't look like a valid link." };
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { ok: false, error: "Only http and https links are allowed." };
    }
    if (PRIVATE_HOST.test(url.hostname)) {
      return { ok: false, error: "That address can't be fetched." };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    let html = "";
    try {
      const res = await fetch(url.toString(), {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en-IN,en;q=0.9,hi;q=0.8",
        },
      });
      if (!res.ok) {
        return { ok: false, error: `The site responded with ${res.status}.` };
      }
      const buf = await res.arrayBuffer();
      if (buf.byteLength > 1_800_000) {
        return { ok: false, error: "The page is too large to scan." };
      }
      html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not reach that page.";
      return {
        ok: false,
        error: msg.toLowerCase().includes("abort") ? "The site took too long." : msg,
      };
    } finally {
      clearTimeout(timer);
    }

    const jsonLd = parseJsonLd(html);
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const host = hostnameFromUrl(url.toString());
    const website = prettySiteName(host) || host;

    const offer = jsonLd ? readOffer(jsonLd) : { price: null, currency: "INR" };
    const metaPrice = meta(html, "product:price:amount") ?? meta(html, "og:price:amount");
    const metaCurrency =
      meta(html, "product:price:currency") ??
      meta(html, "og:price:currency") ??
      offer.currency;

    const name =
      asString(jsonLd?.name) ||
      meta(html, "og:title") ||
      meta(html, "twitter:title") ||
      (titleTag
        ? decodeEntities(titleTag.split("|")[0]!.split("–")[0]!.trim())
        : "") ||
      website;

    const imageUrl =
      asImage(jsonLd?.image, url.toString()) ||
      (() => {
        const raw =
          meta(html, "og:image") ?? meta(html, "twitter:image") ?? meta(html, "og:image:url");
        return raw ? absoluteUrl(raw, url.toString()) : "";
      })();

    const brand =
      asString(jsonLd?.brand) ||
      meta(html, "product:brand") ||
      meta(html, "og:site_name") ||
      "";

    const colorRaw = asString(jsonLd?.color) || meta(html, "product:color") || "";
    const colors = colorRaw
      .split(/[,|/]/)
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 6);

    const description =
      asString(jsonLd?.description) ||
      meta(html, "og:description") ||
      meta(html, "description") ||
      "";

    const priceFromMeta = metaPrice ? Number(metaPrice.replace(/[^\d.]/g, "")) : null;

    return {
      ok: true,
      product: {
        name: name.slice(0, 180),
        imageUrl,
        price:
          offer.price ??
          (priceFromMeta !== null && Number.isFinite(priceFromMeta)
            ? priceFromMeta
            : null),
        currency: metaCurrency || "INR",
        brand: brand.slice(0, 80),
        website,
        colors,
        description: description.slice(0, 400),
      },
    };
  });
