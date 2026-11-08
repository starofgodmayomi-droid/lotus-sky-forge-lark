import { CHECKSUM } from "../CORE/laws.ts";
import type { LedgerEntry } from "../CORE/types.ts";
import { sha256 } from "../03_OMEGA/verifier.ts";

export const GENESIS = CHECKSUM;
const STORAGE_KEY = "omnicos.kai.ledger.v1";

export function canonical(entry: Omit<LedgerEntry, "entry_hash">): string {
  return JSON.stringify({
    timestamp: entry.timestamp,
    intent: entry.intent,
    tool_used: entry.tool_used,
    phase_t: entry.phase_t,
    status: entry.status,
    evidence_hash: entry.evidence_hash,
    reason: entry.reason,
    prev_hash: entry.prev_hash,
  });
}

export async function sealEntry(
  prevHash: string,
  body: Omit<LedgerEntry, "prev_hash" | "entry_hash">,
): Promise<LedgerEntry> {
  const draft = { ...body, prev_hash: prevHash };
  const entry_hash = await sha256(canonical(draft));
  return { ...draft, entry_hash };
}

export async function auditChain(
  entries: LedgerEntry[],
): Promise<{ ok: boolean; brokenAt: number | null }> {
  let prev = GENESIS;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry || entry.prev_hash !== prev) return { ok: false, brokenAt: i };
    const { entry_hash, ...rest } = entry;
    const again = await sha256(canonical(rest));
    if (again !== entry_hash) return { ok: false, brokenAt: i };
    prev = entry_hash;
  }
  return { ok: true, brokenAt: null };
}

export function ledgerDocument(entries: LedgerEntry[]) {
  return {
    genesis: GENESIS,
    doctrine: "append-only; each entry_hash commits the previous",
    entries,
  };
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadLedger(): { entries: LedgerEntry[]; corrupt: boolean } {
  const store = storage();
  if (!store) return { entries: [], corrupt: false };
  const raw = store.getItem(STORAGE_KEY);
  if (!raw) return { entries: [], corrupt: false };
  try {
    const parsed = JSON.parse(raw) as { entries?: unknown };
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [], corrupt: true };
    return { entries: parsed.entries as LedgerEntry[], corrupt: false };
  } catch {
    return { entries: [], corrupt: true };
  }
}

export function saveLedger(entries: LedgerEntry[]): boolean {
  const store = storage();
  if (!store) return false;
  store.setItem(STORAGE_KEY, JSON.stringify(ledgerDocument(entries)));
  return true;
}
