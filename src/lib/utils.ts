import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function hostnameFromUrl(raw: string): string {
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "";
  }
}

export function prettySiteName(host: string): string {
  if (!host) return "";
  const known: Record<string, string> = {
    "amazon.in": "Amazon",
    "amazon.com": "Amazon",
    "flipkart.com": "Flipkart",
    "myntra.com": "Myntra",
    "ajio.com": "Ajio",
    "nykaa.com": "Nykaa",
    "meesho.com": "Meesho",
    "snapdeal.com": "Snapdeal",
    "tatacliq.com": "Tata CLiQ",
    "reliancedigital.in": "Reliance Digital",
    "croma.com": "Croma",
    "ikea.com": "IKEA",
    "zara.com": "Zara",
    "hm.com": "H&M",
    "nike.com": "Nike",
    "adidas.co.in": "Adidas",
    "adidas.com": "Adidas",
    "apple.com": "Apple",
    "ebay.com": "eBay",
    "etsy.com": "Etsy",
    "shein.com": "SHEIN",
    "uniqlo.com": "Uniqlo",
  };
  if (known[host]) return known[host];
  const brand = host.split(".")[0] ?? host;
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

export function safeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProto);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
