import { productsToCsv } from "./csv";
import {
  deleteSheetItem,
  pushAllToSheet,
  upsertSheetItem,
} from "@/lib/server/sheets";
import { useVault } from "./store";
import type { Product } from "./types";

export async function syncUpsert(item: Product): Promise<void> {
  const { connection, setConnection } = useVault.getState();
  if (!connection.autoSync || !connection.webhookUrl) return;
  const res = await upsertSheetItem({
    data: { webhookUrl: connection.webhookUrl, item },
  });
  if (res.ok) {
    setConnection({ lastSyncedAt: new Date().toISOString(), lastError: null });
  } else {
    setConnection({ lastError: res.error });
  }
}

export async function syncDelete(id: string): Promise<void> {
  const { connection, setConnection } = useVault.getState();
  if (!connection.autoSync || !connection.webhookUrl) return;
  const res = await deleteSheetItem({
    data: { webhookUrl: connection.webhookUrl, id },
  });
  if (res.ok) {
    setConnection({ lastSyncedAt: new Date().toISOString(), lastError: null });
  } else {
    setConnection({ lastError: res.error });
  }
}

export async function syncAll(): Promise<{ ok: boolean; error?: string }> {
  const { connection, setConnection, items } = useVault.getState();
  if (!connection.webhookUrl) return { ok: false, error: "No webhook connected." };
  const res = await pushAllToSheet({
    data: {
      webhookUrl: connection.webhookUrl,
      items: items.filter((i) => !i.sample),
    },
  });
  if (res.ok) {
    setConnection({ lastSyncedAt: new Date().toISOString(), lastError: null });
    return { ok: true };
  }
  setConnection({ lastError: res.error });
  return { ok: false, error: res.error };
}

export function downloadCsv(): void {
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
