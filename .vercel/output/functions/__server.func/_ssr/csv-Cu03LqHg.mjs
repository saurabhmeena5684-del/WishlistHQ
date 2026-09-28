import { a as uid } from "./utils-CEYkcLDD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/csv-Cu03LqHg.js
var CATEGORIES = [
	"Fashion",
	"Footwear",
	"Electronics",
	"Beauty",
	"Home",
	"Accessories",
	"Sports",
	"Other"
];
var STATUS_META = {
	watching: {
		label: "Watching",
		hint: "Keeping an eye",
		tone: "neutral"
	},
	sale: {
		label: "Wait for sale",
		hint: "Buy when cheaper",
		tone: "warm"
	},
	budget: {
		label: "Wait for budget",
		hint: "Buy when ready",
		tone: "warm"
	},
	bought: {
		label: "Bought",
		hint: "Already yours",
		tone: "good"
	},
	passed: {
		label: "Passed",
		hint: "Let it go",
		tone: "mute"
	}
};
var COLOR_SWATCHES = [
	{
		name: "Black",
		hex: "#1a1a1a"
	},
	{
		name: "White",
		hex: "#f5f5f2"
	},
	{
		name: "Ivory",
		hex: "#ece6d9"
	},
	{
		name: "Beige",
		hex: "#d8cbb8"
	},
	{
		name: "Tan",
		hex: "#c4a574"
	},
	{
		name: "Brown",
		hex: "#6b4a32"
	},
	{
		name: "Navy",
		hex: "#1c2a4a"
	},
	{
		name: "Blue",
		hex: "#3d6ea8"
	},
	{
		name: "Teal",
		hex: "#2f6b66"
	},
	{
		name: "Green",
		hex: "#3f6b46"
	},
	{
		name: "Olive",
		hex: "#6b6b3a"
	},
	{
		name: "Red",
		hex: "#9b2c2c"
	},
	{
		name: "Burgundy",
		hex: "#6b2434"
	},
	{
		name: "Pink",
		hex: "#d4a0b0"
	},
	{
		name: "Grey",
		hex: "#7a7a7a"
	},
	{
		name: "Silver",
		hex: "#c5c5c8"
	},
	{
		name: "Multi",
		hex: "multi"
	}
];
var SAMPLE_ITEMS = [
	{
		id: "sample-coat",
		name: "Oversized wool overcoat",
		url: "https://www.zara.com/",
		imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
		category: "Fashion",
		price: 7990,
		targetPrice: 5990,
		currency: "INR",
		colors: ["Camel", "Black"],
		brand: "Zara",
		website: "Zara",
		notes: "Wait for winter sale.",
		status: "sale",
		createdAt: "2026-09-12T10:00:00.000Z",
		updatedAt: "2026-09-12T10:00:00.000Z",
		sample: true
	},
	{
		id: "sample-phones",
		name: "WH-1000XM5 wireless headphones",
		url: "https://www.amazon.in/",
		imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
		category: "Electronics",
		price: 24990,
		targetPrice: 19990,
		currency: "INR",
		colors: ["Black", "Silver"],
		brand: "Sony",
		website: "Amazon",
		notes: "Price-drop alert set in my head.",
		status: "watching",
		createdAt: "2026-09-18T08:00:00.000Z",
		updatedAt: "2026-09-18T08:00:00.000Z",
		sample: true
	},
	{
		id: "sample-kicks",
		name: "Air Max everyday sneakers",
		url: "https://www.nike.com/",
		imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
		category: "Footwear",
		price: 8495,
		targetPrice: null,
		currency: "INR",
		colors: ["Red", "White"],
		brand: "Nike",
		website: "Nike",
		notes: "",
		status: "budget",
		createdAt: "2026-09-20T12:00:00.000Z",
		updatedAt: "2026-09-20T12:00:00.000Z",
		sample: true
	},
	{
		id: "sample-lamp",
		name: "Paper shade table lamp",
		url: "https://www.ikea.com/",
		imageUrl: "https://images.unsplash.com/photo-1507473883500-ef53c3793acc?auto=format&fit=crop&w=900&q=80",
		category: "Home",
		price: 2499,
		targetPrice: null,
		currency: "INR",
		colors: ["Ivory", "Wood"],
		brand: "IKEA",
		website: "IKEA",
		notes: "For the reading corner.",
		status: "watching",
		createdAt: "2026-09-22T16:00:00.000Z",
		updatedAt: "2026-09-22T16:00:00.000Z",
		sample: true
	}
];
var SHEET_HEADERS = [
	"Id",
	"Name",
	"Link",
	"Category",
	"Price",
	"Target",
	"Currency",
	"Colors",
	"Brand",
	"Website",
	"Status",
	"Notes",
	"Image",
	"Added"
];
var STATUS_SET = /* @__PURE__ */ new Set([
	"watching",
	"sale",
	"budget",
	"bought",
	"passed"
]);
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = "";
	let inQuotes = false;
	const src = text.replace(/^\uFEFF/, "");
	for (let i = 0; i < src.length; i++) {
		const ch = src[i];
		if (inQuotes) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i++;
				} else inQuotes = false;
			} else cell += ch;
		} else if (ch === "\"") inQuotes = true;
		else if (ch === ",") {
			row.push(cell.trim());
			cell = "";
		} else if (ch === "\n") {
			row.push(cell.trim());
			cell = "";
			if (row.some((c) => c !== "")) rows.push(row);
			row = [];
		} else if (ch !== "\r") cell += ch;
	}
	row.push(cell.trim());
	if (row.some((c) => c !== "")) rows.push(row);
	return rows;
}
function colIndex(headers, aliases) {
	const normalized = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, ""));
	for (const alias of aliases) {
		const i = normalized.indexOf(alias);
		if (i >= 0) return i;
	}
	return -1;
}
function cell(row, i) {
	if (i < 0) return "";
	return row[i] ?? "";
}
function toStatus(raw) {
	const v = raw.toLowerCase().trim();
	if (STATUS_SET.has(v)) return v;
	if (v.includes("sale") || v.includes("cheap")) return "sale";
	if (v.includes("budget") || v.includes("money") || v.includes("later")) return "budget";
	if (v.includes("bought") || v.includes("purchased") || v.includes("owned")) return "bought";
	if (v.includes("pass") || v.includes("skip") || v.includes("drop")) return "passed";
	return "watching";
}
function toNumber(raw) {
	const n = Number(String(raw).replace(/[^\d.]/g, ""));
	return Number.isFinite(n) && raw.trim() !== "" ? n : null;
}
function rowsToProducts(rows) {
	if (rows.length === 0) return [];
	const headers = rows[0].map((h) => h.trim());
	const idx = {
		id: colIndex(headers, ["id", "uuid"]),
		name: colIndex(headers, [
			"name",
			"title",
			"product",
			"item",
			"productname"
		]),
		url: colIndex(headers, [
			"link",
			"url",
			"href",
			"producturl",
			"productlink"
		]),
		category: colIndex(headers, [
			"category",
			"cat",
			"type",
			"section"
		]),
		price: colIndex(headers, [
			"price",
			"cost",
			"mrp",
			"amount",
			"currentprice"
		]),
		target: colIndex(headers, [
			"target",
			"targetprice",
			"wantprice",
			"saleprice"
		]),
		currency: colIndex(headers, ["currency", "curr"]),
		colors: colIndex(headers, [
			"colors",
			"colour",
			"colours",
			"color"
		]),
		brand: colIndex(headers, [
			"brand",
			"maker",
			"label"
		]),
		website: colIndex(headers, [
			"website",
			"site",
			"store",
			"source",
			"shop"
		]),
		status: colIndex(headers, ["status", "state"]),
		notes: colIndex(headers, [
			"notes",
			"note",
			"comment",
			"remarks"
		]),
		image: colIndex(headers, [
			"image",
			"imageurl",
			"img",
			"photo"
		]),
		added: colIndex(headers, [
			"added",
			"created",
			"date",
			"createdat"
		])
	};
	const dataRows = idx.name >= 0 || idx.url >= 0 || headers.some((h) => /name|link|price|brand/i.test(h)) ? rows.slice(1) : rows;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return dataRows.map((row) => {
		const name = cell(row, idx.name) || cell(row, 0);
		const url = cell(row, idx.url);
		if (!name && !url) return null;
		const createdAt = cell(row, idx.added) || now;
		return {
			id: cell(row, idx.id) || uid(),
			name: name || "Untitled",
			url,
			imageUrl: cell(row, idx.image),
			category: cell(row, idx.category) || "Other",
			price: toNumber(cell(row, idx.price)),
			targetPrice: toNumber(cell(row, idx.target)),
			currency: cell(row, idx.currency) || "INR",
			colors: cell(row, idx.colors).split(/[,|/]/).map((c) => c.trim()).filter(Boolean),
			brand: cell(row, idx.brand),
			website: cell(row, idx.website),
			notes: cell(row, idx.notes),
			status: toStatus(cell(row, idx.status)),
			createdAt,
			updatedAt: now
		};
	}).filter((p) => p !== null);
}
function csvEscape(value) {
	const s = value === null || value === void 0 ? "" : String(value);
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
	return s;
}
function productsToCsv(items) {
	return [SHEET_HEADERS.join(","), ...items.map((p) => [
		p.id,
		p.name,
		p.url,
		p.category,
		p.price ?? "",
		p.targetPrice ?? "",
		p.currency,
		p.colors.join(", "),
		p.brand,
		p.website,
		p.status,
		p.notes,
		p.imageUrl,
		p.createdAt
	].map(csvEscape).join(","))].join("\n");
}
function extractSheetId(raw) {
	const trimmed = raw.trim();
	const fromPath = trimmed.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
	if (fromPath?.[1]) return fromPath[1];
	if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return trimmed;
	return null;
}
//#endregion
export { extractSheetId as a, rowsToProducts as c, STATUS_META as i, COLOR_SWATCHES as n, parseCsv as o, SAMPLE_ITEMS as r, productsToCsv as s, CATEGORIES as t };
