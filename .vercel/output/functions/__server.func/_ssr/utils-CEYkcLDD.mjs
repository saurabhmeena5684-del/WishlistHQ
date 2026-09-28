import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-CEYkcLDD.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
function hostnameFromUrl(raw) {
	try {
		return new URL(raw).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
function prettySiteName(host) {
	if (!host) return "";
	const known = {
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
		"uniqlo.com": "Uniqlo"
	};
	if (known[host]) return known[host];
	const brand = host.split(".")[0] ?? host;
	return brand.charAt(0).toUpperCase() + brand.slice(1);
}
function safeHttpUrl(raw) {
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
//#endregion
export { uid as a, safeHttpUrl as i, hostnameFromUrl as n, prettySiteName as r, cn as t };
