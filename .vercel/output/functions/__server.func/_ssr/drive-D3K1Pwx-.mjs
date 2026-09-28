import { t as createServerFn } from "./ssr.mjs";
import { i as GoogleDriveTools, r as ConnectorType } from "./types-BU_vzhZ-.mjs";
import { n as isLoginRequired, t as isConnectorPending } from "./login-CyGRJUUB.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { c as rowsToProducts, o as parseCsv } from "./csv-Cu03LqHg.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drive-D3K1Pwx-.js
var MESSAGE_RULES = [
	{
		needles: ["not_connected", "failed_precondition"],
		kind: "not_connected",
		message: "Connect this connector in Grok to load your data."
	},
	{
		needles: ["scope_denied"],
		kind: "scope_denied",
		message: "This view isn't available — the app requested a tool outside its grant."
	},
	{
		needles: ["access_denied"],
		kind: "access_denied",
		message: "You don't have access to this data."
	}
];
function matchMessageRule(raw) {
	return MESSAGE_RULES.find((rule) => rule.needles.some((needle) => raw.includes(needle)));
}
function classifyCallToolError(result) {
	if (result.ok) return null;
	const detail = result.errorMessage || void 0;
	const raw = (result.errorMessage ?? "").toLowerCase();
	if (isConnectorPending(result)) return {
		kind: "pending",
		message: "Connecting to your data…",
		detail
	};
	if (raw.includes("missing_connector_token")) return {
		kind: "error",
		message: "Open this app from Grok to load your data.",
		detail
	};
	if (isLoginRequired(result)) return {
		kind: "login",
		message: "Continue with Grok to load your data.",
		detail
	};
	const rule = matchMessageRule(raw);
	if (rule) return {
		kind: rule.kind,
		message: rule.message,
		detail
	};
	return {
		kind: "error",
		message: detail ?? "Something went wrong. Try again.",
		detail
	};
}
function asRecord(v) {
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function extractFiles(data) {
	const buckets = [];
	if (Array.isArray(data)) buckets.push(...data);
	const rec = asRecord(data);
	if (rec) {
		for (const key of [
			"files",
			"items",
			"results",
			"documents"
		]) if (Array.isArray(rec[key])) buckets.push(...rec[key]);
		if (typeof rec.id === "string") buckets.push(rec);
	}
	const out = [];
	for (const item of buckets) {
		const r = asRecord(item);
		if (!r) continue;
		const id = typeof r.id === "string" ? r.id : typeof r.file_id === "string" ? r.file_id : "";
		const name = typeof r.name === "string" ? r.name : typeof r.title === "string" ? r.title : "";
		if (!id || !name) continue;
		out.push({
			id,
			name,
			modifiedTime: typeof r.modifiedTime === "string" ? r.modifiedTime : typeof r.modified_time === "string" ? r.modified_time : void 0
		});
	}
	return out;
}
function extractText(data) {
	if (typeof data === "string") return data;
	const rec = asRecord(data);
	if (!rec) return "";
	for (const key of [
		"content",
		"text",
		"data",
		"body",
		"csv"
	]) if (typeof rec[key] === "string") return rec[key];
	if (Array.isArray(rec.rows)) return rec.rows.map((row) => Array.isArray(row) ? row.join(",") : String(row)).join("\n");
	try {
		return JSON.stringify(data);
	} catch {
		return "";
	}
}
var listDriveSheets_createServerFn_handler = createServerRpc({
	id: "3a842e53cbab651a16a107acb31602c45373815526a69a40ec526796c8a53d73",
	name: "listDriveSheets",
	filename: "src/lib/server/drive.ts"
}, (opts) => listDriveSheets.__executeServer(opts));
var listDriveSheets = createServerFn({ method: "POST" }).handler(listDriveSheets_createServerFn_handler, async () => {
	const { callTool } = await import("./client.server-omh5Icjg.mjs");
	const result = await callTool(GoogleDriveTools.search, { query: "mimeType:'application/vnd.google-apps.spreadsheet' OR mimeType:'text/csv'" }, { connectorType: ConnectorType.GoogleDrive });
	if (isConnectorPending(result)) return {
		ok: false,
		pending: true,
		error: "Connecting to Google Drive…"
	};
	if (isLoginRequired(result)) return {
		ok: false,
		loginRequired: true,
		loginUrl: result.loginUrl,
		error: "Continue with Grok to load your Drive."
	};
	if (!result.ok) {
		const classified = classifyCallToolError(result);
		return {
			ok: false,
			error: classified?.message ?? result.errorMessage ?? "Could not search Drive.",
			kind: classified?.kind
		};
	}
	return {
		ok: true,
		files: extractFiles(result.data)
	};
});
var importDriveSheet_createServerFn_handler = createServerRpc({
	id: "89eec03ce9609887ef439b49c7949d5d97099c3e52c5fed8bbd88e445533613d",
	name: "importDriveSheet",
	filename: "src/lib/server/drive.ts"
}, (opts) => importDriveSheet.__executeServer(opts));
var importDriveSheet = createServerFn({ method: "POST" }).validator(object({ fileId: string().min(1) })).handler(importDriveSheet_createServerFn_handler, async ({ data }) => {
	const { callTool } = await import("./client.server-omh5Icjg.mjs");
	const result = await callTool(GoogleDriveTools.readFile, {
		file_id: data.fileId,
		id: data.fileId
	}, { connectorType: ConnectorType.GoogleDrive });
	if (isConnectorPending(result)) return {
		ok: false,
		pending: true,
		error: "Connecting to Google Drive…"
	};
	if (isLoginRequired(result)) return {
		ok: false,
		loginRequired: true,
		loginUrl: result.loginUrl,
		error: "Continue with Grok to load your Drive."
	};
	if (!result.ok) return {
		ok: false,
		error: classifyCallToolError(result)?.message ?? result.errorMessage ?? "Could not read that file."
	};
	const text = extractText(result.data);
	if (!text) return {
		ok: false,
		error: "That file didn't contain readable rows."
	};
	let items = [];
	if (text.trim().startsWith("{") || text.trim().startsWith("[")) try {
		const json = JSON.parse(text);
		const rec = asRecord(json);
		const maybeRows = Array.isArray(json) ? json : rec?.values ?? rec?.rows;
		if (Array.isArray(maybeRows) && maybeRows.every((r) => Array.isArray(r))) items = rowsToProducts(maybeRows);
	} catch {
		items = rowsToProducts(parseCsv(text));
	}
	else items = rowsToProducts(parseCsv(text));
	return {
		ok: true,
		items,
		count: items.length
	};
});
//#endregion
export { importDriveSheet_createServerFn_handler, listDriveSheets_createServerFn_handler };
