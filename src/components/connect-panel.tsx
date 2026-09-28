import { Check, Copy, Loader2, Sheet, Unplug, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Overlay } from "@/components/overlay";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { APPS_SCRIPT_SOURCE } from "@/lib/apps-script";
import { redirectToLoginIfRequired } from "@/lib/app-data";
import { importDriveSheet, listDriveSheets, type DriveFile } from "@/lib/server/drive";
import { importPublishedSheet, pingSheet, pullSheet } from "@/lib/server/sheets";
import { useVault } from "@/lib/store";
import { downloadCsv, syncAll } from "@/lib/sync";

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="max-h-48 overflow-auto rounded-md bg-bg p-3 font-mono text-2xs leading-relaxed text-muted hairline">
        {text}
      </pre>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-sm bg-elevated text-fg hairline"
        aria-label="Copy script"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

function openGrokLogin(loginUrl?: string) {
  redirectToLoginIfRequired({
    ok: false,
    data: null,
    loginRequired: true,
    loginUrl,
  });
}

export function ConnectPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const connection = useVault((s) => s.connection);
  const setConnection = useVault((s) => s.setConnection);
  const mergeFromSheet = useVault((s) => s.mergeFromSheet);
  const items = useVault((s) => s.items);

  const [webhook, setWebhook] = useState(connection.webhookUrl);
  const [sheetUrl, setSheetUrl] = useState(connection.sheetUrl);
  const [busy, setBusy] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFile[] | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveLoginUrl, setDriveLoginUrl] = useState<string | null>(null);
  const [stepOpen, setStepOpen] = useState(true);

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
      lastSyncedAt: new Date().toISOString(),
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
      if ("pending" in res && res.pending) {
        toast.message("Connecting to Drive…");
      }
      return;
    }
    setFiles(res.files);
    if (res.files.length === 0) toast.message("No spreadsheets found in Drive");
  }

  async function importFile(file: DriveFile) {
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
    setConnection({ webhookUrl: "", lastError: null, lastSyncedAt: null });
    setWebhook("");
    toast.message("Sheet unlinked. Your list stays on this device.");
  }

  return (
    <Overlay open={open} onClose={onClose} labelledBy="connect-title">
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-2xs uppercase tracking-caps text-muted">Google Sheet</p>
            <h2 id="connect-title" className="mt-1 font-display text-3xl italic">
              Keep it in one place
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Link a spreadsheet and every save, edit, and delete writes a row —
              category, price, colors, brand, and the shop — ready to sort later.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {connected ? (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-elevated p-4 hairline">
            <Sheet className="size-4 text-good" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-fg">Live sync is on</p>
              <p className="truncate text-xs text-subtle">
                {connection.lastSyncedAt
                  ? `Last synced ${new Date(connection.lastSyncedAt).toLocaleString("en-IN")}`
                  : "Waiting for the first save"}
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={disconnect}>
              <Unplug className="size-3.5" />
              Unlink
            </Button>
          </div>
        ) : null}

        {connection.lastError ? (
          <p className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
            {connection.lastError}
          </p>
        ) : null}

        <section className="rounded-lg bg-elevated/50 p-4 hairline">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setStepOpen((v) => !v)}
          >
            <span className="font-medium">1. Attach a live sheet</span>
            <span className="text-xs text-muted">{stepOpen ? "Hide steps" : "Show steps"}</span>
          </button>
          {stepOpen ? (
            <ol className="mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed text-muted">
              <li>
                <span className="text-fg">Create</span> a Google Sheet (or open an existing one).
              </li>
              <li>
                <span className="text-fg">Extensions → Apps Script</span>, delete the stub, paste
                the script below, then click Save.
              </li>
              <li>
                <span className="text-fg">Deploy → New deployment → Web app</span>. Execute as Me.
                Who has access: Anyone. Copy the URL.
              </li>
            </ol>
          ) : null}
          <div className="mt-4">
            <CopyBlock text={APPS_SCRIPT_SOURCE} />
          </div>
          <div className="mt-4 grid gap-3">
            <Field label="Web app URL">
              <Input
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://script.google.com/macros/s/…/exec"
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => void testAndSave()}
                disabled={!webhook.trim() || busy === "ping"}
              >
                {busy === "ping" ? <Loader2 className="size-4 animate-spin" /> : null}
                Test & link
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void pushNow()}
                disabled={!connected || Boolean(busy)}
              >
                {busy === "push" ? <Loader2 className="size-4 animate-spin" /> : null}
                Push all {items.filter((i) => !i.sample).length} rows
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void pullNow()}
                disabled={!connected || Boolean(busy)}
              >
                {busy === "pull" ? <Loader2 className="size-4 animate-spin" /> : null}
                Pull from sheet
              </Button>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={connection.autoSync}
                onChange={(e) => setConnection({ autoSync: e.target.checked })}
                className="size-4 accent-accent"
              />
              Write each save automatically
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-lg bg-elevated/50 p-4 hairline">
          <p className="font-medium">2. Import a published sheet</p>
          <p className="mt-1 text-sm text-muted">
            Share the sheet as “Anyone with the link can view”, then paste the link.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => void importCsvLink()}
              disabled={!sheetUrl.trim() || busy === "csv"}
            >
              {busy === "csv" ? <Loader2 className="size-4 animate-spin" /> : null}
              Import
            </Button>
          </div>
        </section>

        <section className="mt-4 rounded-lg bg-elevated/50 p-4 hairline">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">3. Pick from Google Drive</p>
              <p className="mt-1 text-sm text-muted">
                Available when this app is opened from Grok with Drive connected.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void browseDrive()}
              disabled={busy === "drive"}
            >
              {busy === "drive" ? <Loader2 className="size-4 animate-spin" /> : null}
              Browse
            </Button>
          </div>
          {driveError ? (
            <div className="mt-3 text-sm text-muted">
              <p>{driveError}</p>
              {driveLoginUrl ? (
                <button
                  type="button"
                  className="mt-2 text-fg underline underline-offset-4"
                  onClick={() => openGrokLogin(driveLoginUrl)}
                >
                  Continue with Grok
                </button>
              ) : null}
            </div>
          ) : null}
          {files && files.length > 0 ? (
            <ul className="mt-3 divide-y divide-border">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-2">
                  <Sheet className="size-4 text-muted" />
                  <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void importFile(f)}
                    disabled={busy === `file-${f.id}`}
                  >
                    Import
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-elevated/50 p-4 hairline">
          <div>
            <p className="font-medium">Need a backup now?</p>
            <p className="mt-1 text-sm text-muted">
              Download CSV and File → Import into any Google Sheet.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={downloadCsv}>
            Download CSV
          </Button>
        </section>

        <p className="mt-5 text-xs leading-relaxed text-subtle">
          Columns written: Name, Link, Category, Price, Target, Colors, Brand, Website,
          Status, Notes, Image.
        </p>
      </div>
    </Overlay>
  );
}
