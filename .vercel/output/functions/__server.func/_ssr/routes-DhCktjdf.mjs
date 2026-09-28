import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { r as redirectToLoginIfRequired } from "./login-CyGRJUUB.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as uid, i as safeHttpUrl, n as hostnameFromUrl, r as prettySiteName, t as cn } from "./utils-CEYkcLDD.mjs";
import { i as STATUS_META, n as COLOR_SWATCHES, r as SAMPLE_ITEMS, s as productsToCsv, t as CATEGORIES } from "./csv-Cu03LqHg.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Sheet, c as LoaderCircle, d as LayoutGrid, f as ExternalLink, g as ArrowUpDown, h as ArrowUpRight, i as Trash2, l as List, m as Check, n as Unplug, o as Search, p as Copy, s as Plus, t as X, u as Link2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhCktjdf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none whitespace-nowrap outline-none tap-press disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg shadow-[0_1px_0_color-mix(in_oklab,white_18%,transparent)_inset] hover:brightness-[1.04]",
			secondary: "bg-elevated text-fg hairline hairline-hover hover:bg-elevated/80",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			sm: "h-9 rounded-sm px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-sm",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var fetchProductFromUrl = createServerFn({ method: "POST" }).validator(object({ url: string().min(4) })).handler(createSsrRpc("61a36193dac944f65c29bb13aa7f3d6fd334d31bc9b03775b2d24d1db194b930"));
function Composer({ onDraft }) {
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(raw) {
		const url = safeHttpUrl(raw);
		if (!url) {
			onDraft({
				name: raw.trim() || "Untitled",
				url: "",
				imageUrl: "",
				category: "Other",
				price: null,
				targetPrice: null,
				currency: "INR",
				colors: [],
				brand: "",
				website: "",
				notes: "",
				status: "watching"
			});
			setValue("");
			return;
		}
		setBusy(true);
		const host = hostnameFromUrl(url);
		try {
			const result = await fetchProductFromUrl({ data: { url } });
			if (result.ok) onDraft({
				name: result.product.name,
				url,
				imageUrl: result.product.imageUrl,
				category: "Other",
				price: result.product.price,
				targetPrice: null,
				currency: result.product.currency || "INR",
				colors: result.product.colors,
				brand: result.product.brand,
				website: result.product.website || prettySiteName(host),
				notes: result.product.description,
				status: "watching"
			});
			else {
				toast.message("Couldn't auto-fill", { description: result.error });
				onDraft({
					name: prettySiteName(host) || "Saved link",
					url,
					imageUrl: "",
					category: "Other",
					price: null,
					targetPrice: null,
					currency: "INR",
					colors: [],
					brand: "",
					website: prettySiteName(host),
					notes: "",
					status: "watching"
				});
			}
			setValue("");
		} catch {
			toast.error("Something went wrong fetching that page.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "relative",
		onSubmit: (e) => {
			e.preventDefault();
			submit(value);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 sm:flex-row sm:items-stretch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value,
						onChange: (e) => setValue(e.target.value),
						placeholder: "Paste a product link to keep it",
						className: "h-14 w-full rounded-lg bg-surface pl-11 pr-4 text-base text-fg outline-none placeholder:text-subtle hairline focus:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]",
						autoComplete: "off",
						enterKeyHint: "go"
					}),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left bg-accent fetch-line" }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				size: "lg",
				className: "h-14 min-w-32 sm:w-auto",
				disabled: busy,
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), busy ? "Reading" : "Save"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-subtle",
			children: "Title, image, price and brand fill in when the listing allows it. You can always edit."
		})]
	});
}
function Overlay({ open, onClose, children, labelledBy }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-bg/70 backdrop-enter",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": labelledBy,
			className: cn("relative z-10 w-full max-h-dvh overflow-y-auto", "rounded-t-xl bg-surface shadow-lift sm:rounded-xl sheet-enter"),
			children
		})]
	});
}
function Field({ label, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("flex flex-col gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xs font-medium uppercase tracking-caps text-muted",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
var controlClass = "w-full rounded-md bg-elevated px-3 text-sm text-fg outline-none placeholder:text-subtle hairline focus:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]";
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(controlClass, "h-11", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(controlClass, "min-h-24 resize-y py-2.5", className),
		...props
	});
}
var APPS_SCRIPT_SOURCE = `const HEADERS = ['Id','Name','Link','Category','Price','Target','Currency','Colors','Brand','Website','Status','Notes','Image','Added'];

function ensureHeaders(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  const current = range.getValues()[0];
  const empty = current.every(function (c) { return c === ''; });
  if (empty || String(current[0]) !== 'Id') {
    range.setValues([HEADERS]);
    range.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function rowToItem(row) {
  return {
    id: String(row[0] || ''),
    name: String(row[1] || ''),
    url: String(row[2] || ''),
    category: String(row[3] || ''),
    price: row[4] === '' ? null : Number(row[4]),
    targetPrice: row[5] === '' ? null : Number(row[5]),
    currency: String(row[6] || 'INR'),
    colors: String(row[7] || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean),
    brand: String(row[8] || ''),
    website: String(row[9] || ''),
    status: String(row[10] || 'watching'),
    notes: String(row[11] || ''),
    imageUrl: String(row[12] || ''),
    createdAt: String(row[13] || new Date().toISOString()),
  };
}

function itemToRow(item) {
  return [
    item.id, item.name, item.url, item.category,
    item.price == null ? '' : item.price,
    item.targetPrice == null ? '' : item.targetPrice,
    item.currency || 'INR',
    (item.colors || []).join(', '),
    item.brand, item.website, item.status, item.notes,
    item.imageUrl, item.createdAt
  ];
}

function findRowById(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function handle(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  ensureHeaders(sheet);
  const action = body.action;
  if (action === 'ping') return { ok: true, title: SpreadsheetApp.getActiveSpreadsheet().getName() };
  if (action === 'list' || action === 'pull') {
    const last = sheet.getLastRow();
    if (last < 2) return { ok: true, items: [] };
    const values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
    return { ok: true, items: values.filter(function (r) { return r[0]; }).map(rowToItem) };
  }
  if (action === 'upsert') {
    const row = itemToRow(body.item);
    const existing = findRowById(sheet, body.item.id);
    if (existing > 0) sheet.getRange(existing, 1, 1, HEADERS.length).setValues([row]);
    else sheet.appendRow(row);
    return { ok: true };
  }
  if (action === 'delete') {
    const existing = findRowById(sheet, body.id);
    if (existing > 0) sheet.deleteRow(existing);
    return { ok: true };
  }
  if (action === 'replaceAll') {
    const last = sheet.getLastRow();
    if (last > 1) sheet.deleteRows(2, last - 1);
    const items = body.items || [];
    if (items.length) {
      const rows = items.map(itemToRow);
      sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return { ok: true, count: items.length };
  }
  return { ok: false, error: 'unknown action' };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    return json(handle(JSON.parse(e.postData.contents)));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    if (e.parameter && e.parameter.payload) {
      return json(handle(JSON.parse(e.parameter.payload)));
    }
    return json(handle({ action: 'list' }));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
`;
var listDriveSheets = createServerFn({ method: "POST" }).handler(createSsrRpc("3a842e53cbab651a16a107acb31602c45373815526a69a40ec526796c8a53d73"));
var importDriveSheet = createServerFn({ method: "POST" }).validator(object({ fileId: string().min(1) })).handler(createSsrRpc("89eec03ce9609887ef439b49c7949d5d97099c3e52c5fed8bbd88e445533613d"));
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
var pingSheet = createServerFn({ method: "POST" }).validator(object({ webhookUrl: webhookSchema })).handler(createSsrRpc("293c4bf3e0fa37412d090a18442676ed08b7be3445bee62ce1f9cfb85436a665"));
var pullSheet = createServerFn({ method: "POST" }).validator(object({ webhookUrl: webhookSchema })).handler(createSsrRpc("09cf23422b3e7c3acac6cad6c3cd64aa003027fbefed67bd2993a04a71fdd9d5"));
var pushAllToSheet = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	items: array(productSchema)
})).handler(createSsrRpc("fed507d782862bcb7a9742ca6f6e37598de99cc7862dfccd7531278000cedba6"));
var upsertSheetItem = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	item: productSchema
})).handler(createSsrRpc("5e71d72437f99bfcd76610b44851135f1d55a8639ce20a9cb175f56082283b10"));
var deleteSheetItem = createServerFn({ method: "POST" }).validator(object({
	webhookUrl: webhookSchema,
	id: string()
})).handler(createSsrRpc("8bc58b53e49886a64553be1cfa06904668480eaac34a0d02d2c531c738571278"));
var importPublishedSheet = createServerFn({ method: "POST" }).validator(object({ sheetUrl: string().min(8) })).handler(createSsrRpc("d783c22c3d7f6ea300a715d5e877311dc2ad453d1ba8b5749d18a9145c19e22a"));
var emptyConnection = {
	webhookUrl: "",
	sheetUrl: "",
	autoSync: true,
	lastSyncedAt: null,
	lastError: null
};
function normalizeDraft(draft, existing) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: draft.id || existing?.id || uid(),
		name: draft.name.trim() || "Untitled",
		url: draft.url.trim(),
		imageUrl: draft.imageUrl.trim(),
		category: draft.category.trim() || "Other",
		price: draft.price,
		targetPrice: draft.targetPrice,
		currency: draft.currency || "INR",
		colors: draft.colors.map((c) => c.trim()).filter(Boolean),
		brand: draft.brand.trim(),
		website: draft.website.trim(),
		notes: draft.notes.trim(),
		status: draft.status,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
		sample: false
	};
}
var useVault = create()(persist((set, get) => ({
	items: SAMPLE_ITEMS,
	hasSeeded: true,
	connection: emptyConnection,
	query: "",
	category: "All",
	sort: "newest",
	view: "gallery",
	statusFilter: "active",
	setQuery: (q) => set({ query: q }),
	setCategory: (c) => set({ category: c }),
	setSort: (s) => set({ sort: s }),
	setView: (v) => set({ view: v }),
	setStatusFilter: (s) => set({ statusFilter: s }),
	seedIfNeeded: () => {
		const { hasSeeded, items } = get();
		if (hasSeeded) return;
		if (items.length > 0) {
			set({ hasSeeded: true });
			return;
		}
		set({
			items: SAMPLE_ITEMS,
			hasSeeded: true
		});
	},
	clearSamples: () => set({
		items: get().items.filter((i) => !i.sample),
		hasSeeded: true
	}),
	upsertItem: (draft) => {
		const existing = draft.id ? get().items.find((i) => i.id === draft.id) : void 0;
		const next = normalizeDraft(draft, existing);
		set({ items: existing ? get().items.map((i) => i.id === next.id ? next : i) : [next, ...get().items.filter((i) => i.id !== next.id)] });
		return next;
	},
	removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
	replaceAll: (items) => set({
		items,
		hasSeeded: true
	}),
	mergeFromSheet: (incoming) => {
		const byId = new Map(get().items.map((i) => [i.id, i]));
		const byUrl = new Map(get().items.filter((i) => i.url).map((i) => [i.url, i]));
		let added = 0;
		let updated = 0;
		const next = [...get().items];
		for (const item of incoming) {
			const hit = byId.get(item.id) ?? (item.url ? byUrl.get(item.url) : void 0);
			if (hit) {
				const merged = {
					...hit,
					...item,
					id: hit.id,
					createdAt: hit.createdAt,
					updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
					sample: false
				};
				const idx = next.findIndex((i) => i.id === hit.id);
				if (idx >= 0) next[idx] = merged;
				updated += 1;
			} else {
				next.unshift({
					...item,
					sample: false
				});
				added += 1;
			}
		}
		set({
			items: next,
			hasSeeded: true
		});
		return {
			added,
			updated
		};
	},
	setConnection: (patch) => set({ connection: {
		...get().connection,
		...patch
	} })
}), {
	name: "vitrine-vault-v2",
	partialize: (s) => ({
		items: s.items,
		hasSeeded: s.hasSeeded,
		connection: s.connection,
		view: s.view,
		sort: s.sort
	})
}));
function visibleItems(items, query, category, sort, statusFilter) {
	const q = query.trim().toLowerCase();
	let list = items;
	if (statusFilter === "active") list = list.filter((i) => i.status !== "bought" && i.status !== "passed");
	else if (statusFilter === "bought") list = list.filter((i) => i.status === "bought");
	if (category !== "All") list = list.filter((i) => i.category === category);
	if (q) list = list.filter((i) => {
		return [
			i.name,
			i.brand,
			i.website,
			i.category,
			i.notes,
			...i.colors
		].join(" ").toLowerCase().includes(q);
	});
	const sorted = [...list];
	switch (sort) {
		case "price-asc":
			sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
			break;
		case "price-desc":
			sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
			break;
		case "name":
			sorted.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case "brand":
			sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
			break;
		default: sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}
	return sorted;
}
async function syncUpsert(item) {
	const { connection, setConnection } = useVault.getState();
	if (!connection.autoSync || !connection.webhookUrl) return;
	const res = await upsertSheetItem({ data: {
		webhookUrl: connection.webhookUrl,
		item
	} });
	if (res.ok) setConnection({
		lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
		lastError: null
	});
	else setConnection({ lastError: res.error });
}
async function syncDelete(id) {
	const { connection, setConnection } = useVault.getState();
	if (!connection.autoSync || !connection.webhookUrl) return;
	const res = await deleteSheetItem({ data: {
		webhookUrl: connection.webhookUrl,
		id
	} });
	if (res.ok) setConnection({
		lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
		lastError: null
	});
	else setConnection({ lastError: res.error });
}
async function syncAll() {
	const { connection, setConnection, items } = useVault.getState();
	if (!connection.webhookUrl) return {
		ok: false,
		error: "No webhook connected."
	};
	const res = await pushAllToSheet({ data: {
		webhookUrl: connection.webhookUrl,
		items: items.filter((i) => !i.sample)
	} });
	if (res.ok) {
		setConnection({
			lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastError: null
		});
		return { ok: true };
	}
	setConnection({ lastError: res.error });
	return {
		ok: false,
		error: res.error
	};
}
function downloadCsv() {
	const { items } = useVault.getState();
	const csv = productsToCsv(items.filter((i) => !i.sample));
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "vitrine-wishlist.csv";
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function CopyBlock({ text }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "max-h-48 overflow-auto rounded-md bg-bg p-3 font-mono text-2xs leading-relaxed text-muted hairline",
			children: text
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: async () => {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			},
			className: "absolute right-2 top-2 flex size-9 items-center justify-center rounded-sm bg-elevated text-fg hairline",
			"aria-label": "Copy script",
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
		})]
	});
}
function openGrokLogin(loginUrl) {
	redirectToLoginIfRequired({
		ok: false,
		data: null,
		loginRequired: true,
		loginUrl
	});
}
function ConnectPanel({ open, onClose }) {
	const connection = useVault((s) => s.connection);
	const setConnection = useVault((s) => s.setConnection);
	const mergeFromSheet = useVault((s) => s.mergeFromSheet);
	const items = useVault((s) => s.items);
	const [webhook, setWebhook] = (0, import_react.useState)(connection.webhookUrl);
	const [sheetUrl, setSheetUrl] = (0, import_react.useState)(connection.sheetUrl);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [files, setFiles] = (0, import_react.useState)(null);
	const [driveError, setDriveError] = (0, import_react.useState)(null);
	const [driveLoginUrl, setDriveLoginUrl] = (0, import_react.useState)(null);
	const [stepOpen, setStepOpen] = (0, import_react.useState)(true);
	const connected = Boolean(connection.webhookUrl);
	async function testAndSave() {
		setBusy("ping");
		const res = await pingSheet({ data: { webhookUrl: webhook.trim() } });
		setBusy(null);
		if (!res.ok) {
			toast.error(res.error);
			setConnection({ lastError: res.error });
			return;
		}
		setConnection({
			webhookUrl: webhook.trim(),
			lastError: null,
			lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		toast.success(`Linked to ${res.title}`);
	}
	async function pushNow() {
		setBusy("push");
		const res = await syncAll();
		setBusy(null);
		if (res.ok) toast.success("List written to your sheet");
		else toast.error(res.error ?? "Push failed");
	}
	async function pullNow() {
		if (!connection.webhookUrl) return;
		setBusy("pull");
		const res = await pullSheet({ data: { webhookUrl: connection.webhookUrl } });
		setBusy(null);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		const { added, updated } = mergeFromSheet(res.items);
		toast.success(`Pulled ${res.items.length} rows · ${added} new, ${updated} updated`);
	}
	async function importCsvLink() {
		setBusy("csv");
		const res = await importPublishedSheet({ data: { sheetUrl: sheetUrl.trim() } });
		setBusy(null);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		setConnection({ sheetUrl: sheetUrl.trim() });
		const { added } = mergeFromSheet(res.items);
		toast.success(`Imported ${res.count} rows · ${added} new`);
	}
	async function browseDrive() {
		setBusy("drive");
		setDriveError(null);
		setDriveLoginUrl(null);
		const res = await listDriveSheets();
		setBusy(null);
		if ("loginRequired" in res && res.loginRequired) {
			setDriveLoginUrl(res.loginUrl ?? null);
			setDriveError(res.error);
			openGrokLogin(res.loginUrl);
			return;
		}
		if (!res.ok) {
			setDriveError(res.error);
			if ("pending" in res && res.pending) toast.message("Connecting to Drive…");
			return;
		}
		setFiles(res.files);
		if (res.files.length === 0) toast.message("No spreadsheets found in Drive");
	}
	async function importFile(file) {
		setBusy(`file-${file.id}`);
		const res = await importDriveSheet({ data: { fileId: file.id } });
		setBusy(null);
		if ("loginRequired" in res && res.loginRequired) {
			openGrokLogin(res.loginUrl);
			return;
		}
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		const { added } = mergeFromSheet(res.items);
		toast.success(`Imported ${file.name} · ${added} new`);
	}
	function disconnect() {
		setConnection({
			webhookUrl: "",
			lastError: null,
			lastSyncedAt: null
		});
		setWebhook("");
		toast.message("Sheet unlinked. Your list stays on this device.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
		open,
		onClose,
		labelledBy: "connect-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl p-5 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xs uppercase tracking-caps text-muted",
							children: "Google Sheet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "connect-title",
							className: "mt-1 font-display text-3xl italic",
							children: "Keep it in one place"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-md text-sm leading-relaxed text-muted",
							children: "Link a spreadsheet and every save, edit, and delete writes a row — category, price, colors, brand, and the shop — ready to sort later."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-3 rounded-lg bg-elevated p-4 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { className: "size-4 text-good" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-fg",
								children: "Live sync is on"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-subtle",
								children: connection.lastSyncedAt ? `Last synced ${new Date(connection.lastSyncedAt).toLocaleString("en-IN")}` : "Waiting for the first save"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: disconnect,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, { className: "size-3.5" }), "Unlink"]
						})
					]
				}) : null,
				connection.lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger",
					children: connection.lastError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg bg-elevated/50 p-4 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center justify-between text-left",
							onClick: () => setStepOpen((v) => !v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "1. Attach a live sheet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: stepOpen ? "Hide steps" : "Show steps"
							})]
						}),
						stepOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Create"
								}), " a Google Sheet (or open an existing one)."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Extensions → Apps Script"
								}), ", delete the stub, paste the script below, then click Save."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Deploy → New deployment → Web app"
								}), ". Execute as Me. Who has access: Anyone. Copy the URL."] })
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, { text: APPS_SCRIPT_SOURCE })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Web app URL",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: webhook,
										onChange: (e) => setWebhook(e.target.value),
										placeholder: "https://script.google.com/macros/s/…/exec"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											onClick: () => void testAndSave(),
											disabled: !webhook.trim() || busy === "ping",
											children: [busy === "ping" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Test & link"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "secondary",
											onClick: () => void pushNow(),
											disabled: !connected || Boolean(busy),
											children: [
												busy === "push" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null,
												"Push all ",
												items.filter((i) => !i.sample).length,
												" rows"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "secondary",
											onClick: () => void pullNow(),
											disabled: !connected || Boolean(busy),
											children: [busy === "pull" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Pull from sheet"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: connection.autoSync,
										onChange: (e) => setConnection({ autoSync: e.target.checked }),
										className: "size-4 accent-accent"
									}), "Write each save automatically"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-lg bg-elevated/50 p-4 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "2. Import a published sheet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Share the sheet as “Anyone with the link can view”, then paste the link."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sheetUrl,
								onChange: (e) => setSheetUrl(e.target.value),
								placeholder: "https://docs.google.com/spreadsheets/d/…",
								className: "flex-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => void importCsvLink(),
								disabled: !sheetUrl.trim() || busy === "csv",
								children: [busy === "csv" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Import"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-lg bg-elevated/50 p-4 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "3. Pick from Google Drive"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Available when this app is opened from Grok with Drive connected."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => void browseDrive(),
								disabled: busy === "drive",
								children: [busy === "drive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Browse"]
							})]
						}),
						driveError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: driveError }), driveLoginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-fg underline underline-offset-4",
								onClick: () => openGrokLogin(driveLoginUrl),
								children: "Continue with Grok"
							}) : null]
						}) : null,
						files && files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border",
							children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { className: "size-4 text-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-sm",
										children: f.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => void importFile(f),
										disabled: busy === `file-${f.id}`,
										children: "Import"
									})
								]
							}, f.id))
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-elevated/50 p-4 hairline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Need a backup now?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Download CSV and File → Import into any Google Sheet."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: downloadCsv,
						children: "Download CSV"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs leading-relaxed text-subtle",
					children: "Columns written: Name, Link, Category, Price, Target, Colors, Brand, Website, Status, Notes, Image."
				})
			]
		})
	});
}
var STATUSES$1 = [
	{
		id: "active",
		label: "Active"
	},
	{
		id: "bought",
		label: "Bought"
	},
	{
		id: "all",
		label: "All"
	}
];
var SORTS = [
	{
		id: "newest",
		label: "Newest"
	},
	{
		id: "price-asc",
		label: "Price ↑"
	},
	{
		id: "price-desc",
		label: "Price ↓"
	},
	{
		id: "brand",
		label: "Brand"
	},
	{
		id: "name",
		label: "Name"
	}
];
function FilterBar() {
	const query = useVault((s) => s.query);
	const setQuery = useVault((s) => s.setQuery);
	const category = useVault((s) => s.category);
	const setCategory = useVault((s) => s.setCategory);
	const sort = useVault((s) => s.sort);
	const setSort = useVault((s) => s.setSort);
	const view = useVault((s) => s.view);
	const setView = useVault((s) => s.setView);
	const statusFilter = useVault((s) => s.statusFilter);
	const setStatusFilter = useVault((s) => s.setStatusFilter);
	const cats = ["All", ...CATEGORIES];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [STATUSES$1.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStatusFilter(s.id),
					className: cn("h-9 rounded-full px-3.5 text-sm tap-press", statusFilter === s.id ? "bg-accent text-accent-fg" : "bg-surface text-muted hairline hover:text-fg"),
					children: s.label
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1 rounded-md bg-surface p-1 hairline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Gallery view",
						onClick: () => setView("gallery"),
						className: cn("flex size-9 items-center justify-center rounded-sm", view === "gallery" ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Table view",
						onClick: () => setView("table"),
						className: cn("flex size-9 items-center justify-center rounded-sm", view === "table" ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 lg:flex-row lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search name, brand, color…",
						className: "h-11 w-full rounded-md bg-surface pl-10 pr-3 text-sm outline-none placeholder:text-subtle hairline"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-11 items-center gap-2 rounded-md bg-surface px-3 text-sm text-muted hairline",
					children: ["Sort", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "bg-transparent text-fg outline-none",
						children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.label
						}, s.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(c),
					className: cn("h-8 shrink-0 rounded-full px-3 text-xs tap-press", category === c ? "bg-elevated text-fg hairline" : "text-muted hover:text-fg"),
					children: c
				}, c))
			})
		]
	});
}
function formatMoney(amount, currency = "INR") {
	if (amount === null || Number.isNaN(amount)) return "—";
	try {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency,
			maximumFractionDigits: amount % 1 === 0 ? 0 : 2
		}).format(amount);
	} catch {
		return `${currency} ${amount}`;
	}
}
function parsePrice(raw) {
	const cleaned = raw.replace(/[^\d.]/g, "");
	if (!cleaned) return null;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : null;
}
function swatchHex(name) {
	const hit = COLOR_SWATCHES.find((c) => c.name.toLowerCase() === name.toLowerCase());
	if (hit) return hit.hex;
	return null;
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "V";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
function fillFor(name) {
	const hex = swatchHex(name);
	if (hex === "multi") return "conic-gradient(from 40deg, #c45c4a, #c4a574, #7d9a7e, #3d6ea8, #c45c4a)";
	if (hex) return hex;
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return `hsl(${Math.abs(hash) % 360} 18% 48%)`;
}
function ColorDots({ colors, size = "sm" }) {
	if (colors.length === 0) return null;
	const dim = size === "md" ? "size-4" : "size-3";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center",
		children: colors.slice(0, 5).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			title: c,
			className: cn(dim, "rounded-full ring-2 ring-surface", i > 0 && "-ml-1"),
			style: { background: fillFor(c) }
		}, `${c}-${i}`))
	});
}
function ColorPicker({ value, onChange }) {
	const toggle = (name) => {
		onChange(value.includes(name) ? value.filter((c) => c !== name) : [...value, name]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: COLOR_SWATCHES.map((c) => {
			const on = value.includes(c.name);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => toggle(c.name),
				className: cn("flex h-9 items-center gap-2 rounded-full px-2.5 text-xs tap-press", on ? "bg-accent text-accent-fg" : "bg-elevated text-muted hairline"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-3 rounded-full",
					style: { background: c.hex === "multi" ? fillFor("Multi") : c.hex }
				}), c.name]
			}, c.name);
		})
	});
}
var STATUSES = Object.entries(STATUS_META);
function emptyDraft() {
	return {
		name: "",
		url: "",
		imageUrl: "",
		category: "Fashion",
		price: null,
		targetPrice: null,
		currency: "INR",
		colors: [],
		brand: "",
		website: "",
		notes: "",
		status: "watching"
	};
}
function ItemEditor({ open, seed, onClose, onSave, onDelete }) {
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft());
	const [priceText, setPriceText] = (0, import_react.useState)("");
	const [targetText, setTargetText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const next = seed ?? emptyDraft();
		setDraft(next);
		setPriceText(next.price === null ? "" : String(next.price));
		setTargetText(next.targetPrice === null ? "" : String(next.targetPrice));
	}, [open, seed]);
	const set = (key, value) => setDraft((d) => ({
		...d,
		[key]: value
	}));
	function handleUrlBlur() {
		const url = safeHttpUrl(draft.url);
		if (!url) return;
		set("url", url);
		if (!draft.website) set("website", prettySiteName(hostnameFromUrl(url)));
	}
	function save() {
		onSave({
			...draft,
			price: parsePrice(priceText),
			targetPrice: parsePrice(targetText)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
		open,
		onClose,
		labelledBy: "editor-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl p-5 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xs uppercase tracking-caps text-muted",
						children: draft.id ? "Edit piece" : "Keep this"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "editor-title",
						className: "mt-1 font-display text-3xl italic leading-tight",
						children: draft.name || "New save"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				draft.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 overflow-hidden rounded-lg bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: draft.imageUrl,
						alt: "",
						className: "max-h-56 w-full object-cover"
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.name,
								onChange: (e) => set("name", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Link",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.url,
								onChange: (e) => set("url", e.target.value),
								onBlur: handleUrlBlur,
								placeholder: "https://"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.brand,
								onChange: (e) => set("brand", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Website",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.website,
								onChange: (e) => set("website", e.target.value),
								placeholder: "Myntra, Amazon…"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: draft.category,
								onChange: (e) => set("category", e.target.value),
								className: "h-11 w-full rounded-md bg-elevated px-3 text-sm hairline outline-none",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Image URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.imageUrl,
								onChange: (e) => set("imageUrl", e.target.value),
								placeholder: "Optional"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Price (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: priceText,
								onChange: (e) => setPriceText(e.target.value),
								placeholder: "0"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Buy when at (₹)",
							hint: "Highlight when the listing hits this",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: targetText,
								onChange: (e) => setTargetText(e.target.value),
								placeholder: "Optional"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: STATUSES.map(([id, meta]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => set("status", id),
									className: cn("h-9 rounded-full px-3 text-xs tap-press", draft.status === id ? "bg-accent text-accent-fg" : "bg-elevated text-muted hairline"),
									children: meta.label
								}, id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Colors",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorPicker, {
								value: draft.colors,
								onChange: (colors) => set("colors", colors)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Notes",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.notes,
								onChange: (e) => set("notes", e.target.value),
								placeholder: "Size, why you want it, when to buy…"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: save,
							children: "Save to list"
						}),
						draft.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: draft.url,
								target: "_blank",
								rel: "noreferrer",
								children: ["Open listing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
						draft.id && onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "danger",
							onClick: () => onDelete(draft.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
						}) : null
					]
				})
			]
		})
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		fill: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "7",
			className: "fill-elevated"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			fillRule: "evenodd",
			d: "M10 5.5h12c1.4 0 2.5 1.1 2.5 2.5v16c0 1.4-1.1 2.5-2.5 2.5H10c-1.4 0-2.5-1.1-2.5-2.5V8c0-1.4 1.1-2.5 2.5-2.5zm1.75 3.25h8.5v13.5h-8.5V8.75z"
		})]
	});
}
function ProductCard({ item, index, onOpen }) {
	const ready = item.targetPrice !== null && item.price !== null && item.price <= item.targetPrice;
	const meta = STATUS_META[item.status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group card-enter",
		style: { animationDelay: `${Math.min(index, 10) * 40}ms` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onOpen(item),
			className: "flex w-full flex-col text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-portrait overflow-hidden rounded-lg bg-elevated",
				children: [
					item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.imageUrl,
						alt: "",
						className: "size-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-full items-center justify-center bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl italic text-subtle",
							children: initials(item.brand || item.name)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent opacity-80" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-3xs font-medium uppercase tracking-caps", "bg-bg/70 text-fg backdrop-blur-sm"),
						children: item.category
					}),
					ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-3 top-3 rounded-full bg-good/90 px-2.5 py-1 text-3xs font-medium uppercase tracking-caps text-bg",
						children: "At target"
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5 px-1 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xs uppercase tracking-caps text-muted",
							children: item.brand || item.website || "Saved"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-0.5 truncate font-display text-lg italic leading-snug text-fg",
							children: item.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDots, { colors: item.colors })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular-nums text-sm text-fg",
						children: [formatMoney(item.price, item.currency), item.targetPrice !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs text-muted",
							children: ["want ", formatMoney(item.targetPrice, item.currency)]
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xs text-subtle",
						children: meta.label
					})]
				})]
			})]
		}), item.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: item.url,
			target: "_blank",
			rel: "noreferrer",
			className: "mt-2 inline-flex h-9 items-center gap-1 rounded-sm px-1 text-xs text-muted hover:text-fg",
			children: [item.website || "Open listing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
		}) : null]
	});
}
var COLS = [
	{
		key: "name",
		label: "Product"
	},
	{
		key: "brand",
		label: "Brand"
	},
	{
		key: "newest",
		label: "Added"
	},
	{
		key: "price-asc",
		label: "Price"
	}
];
function ProductTable({ items, onOpen }) {
	const sort = useVault((s) => s.sort);
	const setSort = useVault((s) => s.setSort);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl bg-surface hairline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-table text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border text-2xs uppercase tracking-caps text-muted",
				children: [
					COLS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex items-center gap-1.5 hover:text-fg",
							onClick: () => setSort(col.key === "price-asc" && sort === "price-asc" ? "price-desc" : col.key),
							children: [col.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3 opacity-50" })]
						})
					}, col.key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Colors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Site"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Status"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "cursor-pointer border-b border-border last:border-0 hover:bg-elevated/50",
				onClick: () => onOpen(item),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-10 shrink-0 overflow-hidden rounded-sm bg-elevated",
								children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.imageUrl,
									alt: "",
									className: "size-full object-cover"
								}) : null
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium text-fg",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: item.category
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted",
						children: item.brand || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted tabular-nums",
						children: new Date(item.createdAt).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 tabular-nums text-fg",
						children: formatMoney(item.price, item.currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDots, { colors: item.colors })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted",
						children: item.website || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-elevated px-2 py-0.5 text-2xs text-muted",
							children: STATUS_META[item.status].label
						})
					})
				]
			}, item.id)) })]
		})
	});
}
function VaultApp() {
	const items = useVault((s) => s.items);
	const view = useVault((s) => s.view);
	const query = useVault((s) => s.query);
	const category = useVault((s) => s.category);
	const sort = useVault((s) => s.sort);
	const statusFilter = useVault((s) => s.statusFilter);
	const connection = useVault((s) => s.connection);
	const upsertItem = useVault((s) => s.upsertItem);
	const removeItem = useVault((s) => s.removeItem);
	const clearSamples = useVault((s) => s.clearSamples);
	const visible = (0, import_react.useMemo)(() => visibleItems(items, query, category, sort, statusFilter), [
		items,
		query,
		category,
		sort,
		statusFilter
	]);
	const [connectOpen, setConnectOpen] = (0, import_react.useState)(false);
	const [editorOpen, setEditorOpen] = (0, import_react.useState)(false);
	const [seed, setSeed] = (0, import_react.useState)(null);
	const samples = items.some((i) => i.sample);
	const displayValue = items.filter((i) => i.status !== "bought" && i.status !== "passed").reduce((sum, i) => sum + (i.price ?? 0), 0);
	function openNew(draft) {
		setSeed(draft);
		setEditorOpen(true);
	}
	function openExisting(item) {
		setSeed(item);
		setEditorOpen(true);
	}
	function handleSave(draft) {
		const saved = upsertItem(draft);
		setEditorOpen(false);
		toast.success(draft.id ? "Updated" : "Saved to your list");
		syncUpsert(saved);
	}
	function handleDelete(id) {
		removeItem(id);
		setEditorOpen(false);
		toast.message("Removed");
		syncDelete(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_circle_at_50%_-10%,color-mix(in_oklab,var(--color-fg)_6%,transparent),transparent_55%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center gap-3 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-8 text-fg" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "leading-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl italic tracking-tight",
								children: "Vitrine"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: connection.webhookUrl ? "secondary" : "primary",
								size: "sm",
								onClick: () => setConnectOpen(true),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: connection.webhookUrl ? "Sheet linked" : "Link Google Sheet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "Sheet"
									})
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-10 sm:pt-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stagger-in max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xs uppercase tracking-caps text-muted",
								children: "Window shop. Keep. Buy later."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-4xl italic leading-tight tracking-tight sm:text-5xl",
								children: "A private shop window for everything you might buy."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base",
								children: "Paste a link. We catch the name, price, brand and shop. Sort by color, category, or what you're waiting on — then send it to your Google Sheet in one motion."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 max-w-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, { onDraft: openNew })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xs uppercase tracking-caps text-muted",
							children: "On the list"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-3xl italic tabular-nums",
							children: [visible.length, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-3 text-lg not-italic text-muted",
								children: formatMoney(displayValue)
							})]
						})] }), samples ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: clearSamples,
							children: "Clear example pieces"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {})
					}),
					visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl italic",
							children: "Nothing here yet."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Paste a Myntra, Amazon, or any product URL above. It will live on this device until you link a sheet — then it follows you."
						})]
					}) : view === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTable, {
							items: visible,
							onOpen: openExisting
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
						children: visible.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							item,
							index: i,
							onOpen: openExisting
						}, item.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemEditor, {
				open: editorOpen,
				seed,
				onClose: () => setEditorOpen(false),
				onSave: handleSave,
				onDelete: handleDelete
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectPanel, {
				open: connectOpen,
				onClose: () => setConnectOpen(false)
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultApp, {});
}
//#endregion
export { Home as component };
