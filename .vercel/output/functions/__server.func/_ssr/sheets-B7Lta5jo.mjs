import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as extractSheetId, c as rowsToProducts, o as parseCsv } from "./csv-Cu03LqHg.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sheets-B7Lta5jo.js
var productSchema = object({
	id: string(),
	name: string(),
	url: string(),
	imageUrl: string(),
	category: string(),
	price: number().nullable(),
	targetPrice: number().nullable(),
	currency: string(),
	colors: array(string()),
	brand: string(),
	website: string(),
	notes: string(),
	status: _enum([
		"watching",
		"sale",
		"budget",
		"bought",
		"passed"
	]),
	createdAt: string(),
	updatedAt: string(),
	sample: boolean().optional()
});
var webhookSchema = string().min(12);
function looksLikeJson(text) {
	const t = text.trim();
	return t.startsWith("{") || t.startsWith("[");
}
async function callWebhook(webhookUrl, body) {
	let parsed;
	try {
		parsed = new URL(webhookUrl);
	} catch {
		return {
			ok: false,
			data: null,
			error: "That webhook URL isn't valid."
		};
	}
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return {
		ok: false,
		data: null,
		error: "Webhook must be an http(s) URL."
	};
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 18e3);
	try {
		const res = await fetch(parsed.toString(), {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			redirect: "follow",
			signal: controller.signal
		});
		const text = await res.text();
		if (looksLikeJson(text)) return {
			ok: true,
			data: JSON.parse(text)
		};
		if (text.includes("<html") || text.includes("<HTML")) return {
			ok: false,
			data: null,
			error: "Google returned a login page. Deploy the script as a Web app with access set to Anyone."
		};
		if (!res.ok) return {
			ok: false,
			data: null,
			error: `Sheet webhook responded ${res.status}.`
		};
		return {
			ok: false,
			data: null,
			error: "Unexpected response from the sheet webhook."
		};
	} catch (err) {
		return {
			ok: false,
			data: null,
			error: err instanceof Error ? err.message : "Could not reach the webhook."
		};
	} finally {
		clearTimeout(timer);
	}
}
function itemsFromData(data) {
	if (!data || typeof data !== "object") return [];
	const obj = data;
	if (!Array.isArray(obj.items)) return [];
	const out = [];
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
			createdAt: p.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: p.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	return out;
}
var pingSheet_createServerFn_handler = createServerRpc({
	id: "293c4bf3e0fa37412d090a18442676ed08b7be3445bee62ce1f9cfb85436a665",
	name: "pingSheet",
	filename: "src/lib/server/sheets.ts"
}, (opts) => pingSheet.__executeServer(opts));
var pingSheet = createServerFn({ method: "POST" }).validator(object({ webhookUrl: webhookSchema })).handler(pingSheet_createServerFn_handler, async ({ data }) => {
	const result = await callWebhook(data.webhookUrl, { action: "ping" });
	if (!result.ok) return {
		ok: false,
		error: result.error ?? "Ping failed."
	};
	const payload = result.data;
	if (payload && payload.ok === false) return {
		ok: false,
		error: payload.error ?? "Webhook error."
	};
	return {
		ok: true,
		title: typeof payload?.title === "string" ? payload.title : "Google Sheet"
	};
});
var pullSheet_createServerFn_handler = createServerRpc({
	id: "09cf23422b3e7c3acac6cad6c3cd64aa003027fbefed67bd2993a04a71fdd9d5",
	name: "pullSheet",
	filename: "src/lib/server/sheets.ts"
}, (opts) => pullSheet.__executeServer(opts));
var pullSheet = createServerFn({ method: "POST" }).validator(object({ webhookUrl: webhookSchema })).handler(pullSheet_createServerFn_handler, async ({ data }) => {
	const result = await callWebhook(data.webhookUrl, { action: "list" });
	if (!result.ok) return {
		ok: false,
		error: result.error ?? "Pull failed."
	};
	return {
		ok: true,
		items: itemsFromData(result.data)
	};
});
var pushAllToSheet_createServerFn_handler = createServerRpc({
	id: "fed507d782862bcb7a9742ca6f6e37598de99cc7862dfccd7531278000cedba6",
	name: "pushAllToSheet",
	filename: "src/lib/server/sheets.ts"
}, (opts) => pushAllToSheet.__executeServer(opts));
var pushAllToSheet = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	items: array(productSchema)
})).handler(pushAllToSheet_createServerFn_handler, async ({ data }) => {
	const result = await callWebhook(data.webhookUrl, {
		action: "replaceAll",
		items: data.items.map(({ sample: _s, ...rest }) => rest)
	});
	if (!result.ok) return {
		ok: false,
		error: result.error ?? "Push failed."
	};
	return { ok: true };
});
var upsertSheetItem_createServerFn_handler = createServerRpc({
	id: "5e71d72437f99bfcd76610b44851135f1d55a8639ce20a9cb175f56082283b10",
	name: "upsertSheetItem",
	filename: "src/lib/server/sheets.ts"
}, (opts) => upsertSheetItem.__executeServer(opts));
var upsertSheetItem = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	item: productSchema
})).handler(upsertSheetItem_createServerFn_handler, async ({ data }) => {
	const { sample: _s, ...item } = data.item;
	const result = await callWebhook(data.webhookUrl, {
		action: "upsert",
		item
	});
	if (!result.ok) return {
		ok: false,
		error: result.error ?? "Sync failed."
	};
	return { ok: true };
});
var deleteSheetItem_createServerFn_handler = createServerRpc({
	id: "8bc58b53e49886a64553be1cfa06904668480eaac34a0d02d2c531c738571278",
	name: "deleteSheetItem",
	filename: "src/lib/server/sheets.ts"
}, (opts) => deleteSheetItem.__executeServer(opts));
var deleteSheetItem = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	id: string()
})).handler(deleteSheetItem_createServerFn_handler, async ({ data }) => {
	const result = await callWebhook(data.webhookUrl, {
		action: "delete",
		id: data.id
	});
	if (!result.ok) return {
		ok: false,
		error: result.error ?? "Delete failed."
	};
	return { ok: true };
});
var importPublishedSheet_createServerFn_handler = createServerRpc({
	id: "d783c22c3d7f6ea300a715d5e877311dc2ad453d1ba8b5749d18a9145c19e22a",
	name: "importPublishedSheet",
	filename: "src/lib/server/sheets.ts"
}, (opts) => importPublishedSheet.__executeServer(opts));
var importPublishedSheet = createServerFn({ method: "POST" }).validator(object({ sheetUrl: string().min(8) })).handler(importPublishedSheet_createServerFn_handler, async ({ data }) => {
	const id = extractSheetId(data.sheetUrl);
	if (!id) return {
		ok: false,
		error: "Could not read a Sheet ID from that link."
	};
	const urls = [`https://docs.google.com/spreadsheets/d/${id}/export?format=csv`, `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`];
	let lastError = "Could not download the sheet.";
	for (const url of urls) try {
		const res = await fetch(url, {
			redirect: "follow",
			headers: { accept: "text/csv,text/plain" }
		});
		const text = await res.text();
		if (!res.ok || text.includes("<html") || text.includes("<HTML")) {
			lastError = "The sheet is not public. Use File → Share → Anyone with the link, or Publish to web.";
			continue;
		}
		const rows = parseCsv(text);
		const items = rowsToProducts(rows);
		return {
			ok: true,
			items,
			count: items.length
		};
	} catch (err) {
		lastError = err instanceof Error ? err.message : lastError;
	}
	return {
		ok: false,
		error: lastError
	};
});
//#endregion
export { deleteSheetItem_createServerFn_handler, importPublishedSheet_createServerFn_handler, pingSheet_createServerFn_handler, pullSheet_createServerFn_handler, pushAllToSheet_createServerFn_handler, upsertSheetItem_createServerFn_handler };
