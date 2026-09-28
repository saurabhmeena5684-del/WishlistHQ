import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { n as hostnameFromUrl, r as prettySiteName } from "./utils-CEYkcLDD.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-product-DZHA4rVE.js
var PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.0\.0\.0|\[::1\]|metadata\.|.*\.local|.*\.internal)$/i;
function decodeEntities(s) {
	return s.replace(/&/g, "&").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/</g, "<").replace(/>/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/\\u002F/g, "/").replace(/\\u0026/g, "&");
}
function meta(html, key) {
	const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const patterns = [new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"), new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name|itemprop)=["']${escaped}["']`, "i")];
	for (const re of patterns) {
		const m = html.match(re);
		if (m?.[1]) return decodeEntities(m[1].trim());
	}
	return null;
}
function absoluteUrl(maybe, pageUrl) {
	try {
		return new URL(maybe, pageUrl).toString();
	} catch {
		return maybe;
	}
}
function parseJsonLd(html) {
	const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
	let match;
	const nodes = [];
	while (match = re.exec(html)) try {
		const parsed = JSON.parse(match[1].trim());
		if (Array.isArray(parsed)) nodes.push(...parsed);
		else nodes.push(parsed);
	} catch {}
	const flatten = (n) => {
		if (!n || typeof n !== "object") return [];
		const obj = n;
		const graph = obj["@graph"];
		if (Array.isArray(graph)) return graph.flatMap(flatten);
		return [obj];
	};
	return nodes.flatMap(flatten).find((n) => {
		const t = n["@type"];
		return (Array.isArray(t) ? t : [t]).some((x) => typeof x === "string" && /product/i.test(x));
	}) ?? null;
}
function readOffer(product) {
	const offers = product.offers;
	const offer = Array.isArray(offers) ? offers[0] : offers;
	if (!offer || typeof offer !== "object") return {
		price: null,
		currency: "INR"
	};
	const o = offer;
	const raw = o.price ?? o.lowPrice;
	const price = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : null;
	const currency = typeof o.priceCurrency === "string" ? o.priceCurrency : "INR";
	return {
		price: price !== null && Number.isFinite(price) ? price : null,
		currency
	};
}
function asString(v) {
	if (typeof v === "string") return v;
	if (v && typeof v === "object" && "name" in v && typeof v.name === "string") return v.name;
	return "";
}
function asImage(v, pageUrl) {
	if (typeof v === "string") return absoluteUrl(v, pageUrl);
	if (Array.isArray(v) && v.length) return asImage(v[0], pageUrl);
	if (v && typeof v === "object" && "url" in v) return asImage(v.url, pageUrl);
	return "";
}
var fetchProductFromUrl_createServerFn_handler = createServerRpc({
	id: "61a36193dac944f65c29bb13aa7f3d6fd334d31bc9b03775b2d24d1db194b930",
	name: "fetchProductFromUrl",
	filename: "src/lib/server/fetch-product.ts"
}, (opts) => fetchProductFromUrl.__executeServer(opts));
var fetchProductFromUrl = createServerFn({ method: "POST" }).validator(object({ url: string().min(4) })).handler(fetchProductFromUrl_createServerFn_handler, async ({ data }) => {
	let url;
	try {
		url = new URL(data.url);
	} catch {
		return {
			ok: false,
			error: "That doesn't look like a valid link."
		};
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") return {
		ok: false,
		error: "Only http and https links are allowed."
	};
	if (PRIVATE_HOST.test(url.hostname)) return {
		ok: false,
		error: "That address can't be fetched."
	};
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 9e3);
	let html = "";
	try {
		const res = await fetch(url.toString(), {
			signal: controller.signal,
			redirect: "follow",
			headers: {
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
				accept: "text/html,application/xhtml+xml",
				"accept-language": "en-IN,en;q=0.9,hi;q=0.8"
			}
		});
		if (!res.ok) return {
			ok: false,
			error: `The site responded with ${res.status}.`
		};
		const buf = await res.arrayBuffer();
		if (buf.byteLength > 18e5) return {
			ok: false,
			error: "The page is too large to scan."
		};
		html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Could not reach that page.";
		return {
			ok: false,
			error: msg.toLowerCase().includes("abort") ? "The site took too long." : msg
		};
	} finally {
		clearTimeout(timer);
	}
	const jsonLd = parseJsonLd(html);
	const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
	const host = hostnameFromUrl(url.toString());
	const website = prettySiteName(host) || host;
	const offer = jsonLd ? readOffer(jsonLd) : {
		price: null,
		currency: "INR"
	};
	const metaPrice = meta(html, "product:price:amount") ?? meta(html, "og:price:amount");
	const metaCurrency = meta(html, "product:price:currency") ?? meta(html, "og:price:currency") ?? offer.currency;
	const name = asString(jsonLd?.name) || meta(html, "og:title") || meta(html, "twitter:title") || (titleTag ? decodeEntities(titleTag.split("|")[0].split("–")[0].trim()) : "") || website;
	const imageUrl = asImage(jsonLd?.image, url.toString()) || (() => {
		const raw = meta(html, "og:image") ?? meta(html, "twitter:image") ?? meta(html, "og:image:url");
		return raw ? absoluteUrl(raw, url.toString()) : "";
	})();
	const brand = asString(jsonLd?.brand) || meta(html, "product:brand") || meta(html, "og:site_name") || "";
	const colors = (asString(jsonLd?.color) || meta(html, "product:color") || "").split(/[,|/]/).map((c) => c.trim()).filter(Boolean).slice(0, 6);
	const description = asString(jsonLd?.description) || meta(html, "og:description") || meta(html, "description") || "";
	const priceFromMeta = metaPrice ? Number(metaPrice.replace(/[^\d.]/g, "")) : null;
	return {
		ok: true,
		product: {
			name: name.slice(0, 180),
			imageUrl,
			price: offer.price ?? (priceFromMeta !== null && Number.isFinite(priceFromMeta) ? priceFromMeta : null),
			currency: metaCurrency || "INR",
			brand: brand.slice(0, 80),
			website,
			colors,
			description: description.slice(0, 400)
		}
	};
});
//#endregion
export { fetchProductFromUrl_createServerFn_handler };
