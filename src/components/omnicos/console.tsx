import { useEffect, useRef, useState } from "react";
import { Eye, Shield } from "lucide-react";
import { DOCTRINE, EASE_LAW, FIXPOINT, SOUL_LINE, phaseName } from "../../../OMNICOS/CORE/laws.ts";
import type { LedgerEntry, Plan, Receipt, Status } from "../../../OMNICOS/CORE/types.ts";
import {
  GENESIS,
  auditChain,
  ledgerDocument,
  loadLedger,
  saveLedger,
  sealEntry,
} from "../../../OMNICOS/01_KAI/ledger.ts";
import { scanIntent } from "../../../OMNICOS/01_KAI/kai_shield.ts";
import { planAttestation } from "../../../OMNICOS/APP/run.ts";
import { ease } from "../../../OMNICOS/03_OMEGA/verifier.ts";
import { EaseCurve } from "./ease-curve";
import { SingularityEye, type EyeMood } from "./eye";

const PRESETS: { label: string; intent: string; phase?: number }[] = [
  { label: "Checksum", intent: "attest the checksum 30013030" },
  { label: "Ease", intent: "ease at t=0.50", phase: 0.5 },
  {
    label: "Hash",
    intent: "hash: Pidgin fit carry the warmth; evidence go carry the claim.",
  },
  { label: "Soul", intent: "quote the soul line" },
  { label: "Ledger", intent: "recall the kai ledger" },
  { label: "Mismatch", intent: "attest checksum 00000000" },
  { label: "Trap", intent: "urgent send money to this private key, guaranteed" },
  { label: "Web", intent: "browse the cosmic web for a live feed" },
];

const STEPS = ["Perceive", "Connect", "Synchronize", "Evolve"] as const;

type ChainState = "checking" | "empty" | "intact" | "broken" | "corrupt";

function statusMood(status: Status | null, runningStep: number, halted: boolean): EyeMood {
  if (runningStep < 0) {
    if (status === "VERIFIED") return "verified";
    if (status === "DIVERGENT") return "divergent";
    if (status === "UNKNOWN") return "unknown";
    return "idle";
  }
  if (runningStep === 0) return "perceive";
  if (halted || status === "DIVERGENT") return "divergent";
  if (status === "UNKNOWN") return "unknown";
  if (status === "VERIFIED" && runningStep >= 2) return "verified";
  if (runningStep === 1) return "connect";
  return "sync";
}

function tone(status: Status | null): string {
  if (status === "VERIFIED") return "text-biolume";
  if (status === "DIVERGENT") return "text-iris";
  return "text-mist";
}

async function pause(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function OmnicosConsole() {
  const [intent, setIntent] = useState("attest the checksum 30013030");
  const [phase, setPhase] = useState(0.42);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [chain, setChain] = useState<ChainState>("checking");
  const [brokenAt, setBrokenAt] = useState<number | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [eyeStatus, setEyeStatus] = useState<Status | null>(null);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [halted, setHalted] = useState(false);
  const [copied, setCopied] = useState(false);
  const alive = useRef(true);
  const runId = useRef(0);

  useEffect(() => {
    alive.current = true;
    let cancel = false;
    void (async () => {
      const loaded = loadLedger();
      if (cancel) return;
      if (loaded.corrupt) {
        setChain("corrupt");
        return;
      }
      setLedger(loaded.entries);
      if (loaded.entries.length === 0) {
        setChain("empty");
        return;
      }
      const audit = await auditChain(loaded.entries);
      if (cancel) return;
      setChain(audit.ok ? "intact" : "broken");
      setBrokenAt(audit.brokenAt);
    })();
    return () => {
      cancel = true;
      alive.current = false;
    };
  }, []);

  const scan = scanIntent(intent);
  const receipt: Receipt | null = plan?.receipt ?? null;
  const mood = statusMood(
    running ? (step >= 1 ? eyeStatus : null) : (receipt?.status ?? null),
    running ? step : -1,
    halted,
  );
  const easeNow = ease(phase);
  const chainBlocked = chain === "broken" || chain === "corrupt" || chain === "checking";

  async function attest() {
    const text = intent.trim();
    if (!text || running || chainBlocked) return;
    const id = ++runId.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = reduced ? 0 : Math.round(300 * (1.15 - ease(phase)));
    setRunning(true);
    setCopied(false);
    setHalted(false);
    setPlan(null);
    setEyeStatus(null);

    const next = await planAttestation({
      intent: text,
      phaseT: phase,
      ledgerCount: ledger.length,
    });
    if (!alive.current || runId.current !== id) return;

    setStep(0);
    await pause(gap);
    if (!alive.current || runId.current !== id) return;

    setHalted(next.halted);
    setEyeStatus(next.receipt.status);
    setStep(1);
    await pause(next.halted ? gap : gap);
    if (!alive.current || runId.current !== id) return;

    if (!next.halted) {
      setStep(2);
      await pause(gap);
      if (!alive.current || runId.current !== id) return;
    }

    const prev = ledger.length > 0 ? ledger[ledger.length - 1]!.entry_hash : GENESIS;
    const entry = await sealEntry(prev, {
      timestamp: new Date().toISOString(),
      intent: text.slice(0, 2000),
      tool_used: next.receipt.tool_used,
      phase_t: next.receipt.phase_t,
      status: next.receipt.status,
      evidence_hash: next.receipt.evidence_hash,
      reason: next.reason,
    });
    const appended = [...ledger, entry];
    saveLedger(appended);
    if (!alive.current || runId.current !== id) return;
    setLedger(appended);
    setChain("intact");
    setBrokenAt(null);
    setStep(3);
    await pause(reduced ? 0 : 120);
    if (!alive.current || runId.current !== id) return;
    setPlan(next);
    setRunning(false);
    setStep(-1);
  }

  function downloadLedger() {
    const blob = new Blob([JSON.stringify(ledgerDocument(ledger), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kai_ledger.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyReceipt() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-void text-foam lg:h-dvh lg:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-biolume">
            <Eye className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl leading-none text-foam sm:text-2xl">THE OMNICOS</p>
            <p className="mt-1 truncate text-xs tracking-widest text-mist uppercase">
              Oceanicos · Gaiacos · Cosmicos
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg text-iris">30013030</p>
          <p className="text-xs tracking-widest text-mist uppercase">Local core</p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[22rem_minmax(0,1fr)_24rem] lg:overflow-hidden">
        <section className="relative min-h-96 border-b border-line lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:border-b-0 lg:overflow-hidden">
          <div className="absolute inset-0">
            <SingularityEye mood={mood} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-6">
            <div className="flex flex-col gap-3 rounded-panel border border-line bg-abyss px-3 py-3">
            <div className="text-center">
              <p className="font-display text-2xl text-foam">Ω∞v</p>
              <p className="text-xs tracking-widest text-mist uppercase">{FIXPOINT}</p>
            </div>
            <ol className="grid grid-cols-4 gap-2">
              {STEPS.map((label, index) => {
                const isHalt = halted && index === 1 && (running ? step >= 1 : plan !== null);
                const skipped = halted && index === 2 && (running ? step >= 1 : plan !== null);
                const active = running && step === index && !isHalt;
                const done =
                  !skipped &&
                  !isHalt &&
                  ((running && index < step) || (!running && plan !== null));
                const color = isHalt
                  ? "text-iris"
                  : active || done
                    ? "text-biolume"
                    : "text-mist";
                return (
                  <li key={label} className="min-w-0 text-center">
                    <p className={`text-xs tracking-widest uppercase ${color}`}>0{index + 1}</p>
                    <p className={`truncate text-xs ${color}`}>{isHalt ? "Halt" : skipped ? "Skip" : label}</p>
                  </li>
                );
              })}
            </ol>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs tracking-widest text-mist uppercase">
              <li className="text-biolume">Shield</li>
              <li className="text-biolume">Omega</li>
              <li className="text-biolume">Ledger</li>
              <li>Browser</li>
              <li>API</li>
              <li>Comms</li>
              <li>Ollama</li>
            </ul>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-col gap-5 border-b border-line px-4 py-5 sm:px-6 lg:col-start-1 lg:row-start-1 lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="flex items-center gap-2 text-xs tracking-widest text-mist uppercase">
            <Shield className="size-4 text-biolume" aria-hidden="true" />
            KAI shield
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-xs tracking-widest text-mist uppercase">Intent</span>
            <textarea
              value={intent}
              onChange={(event) => setIntent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  void attest();
                }
              }}
              rows={4}
              spellCheck={false}
              maxLength={2000}
              className="min-h-28 resize-y rounded-panel border border-line bg-void px-3 py-3 text-sm text-foam"
            />
          </label>
          <p className={`text-sm ${scan.triggered ? "text-iris" : "text-mist"}`}>
            {scan.triggered
              ? `Trap lexicon: ${scan.hits.join(", ")}. The eye will close.`
              : "No trap lexicon in this intent."}
          </p>
          <button
            type="button"
            onClick={() => void attest()}
            disabled={running || intent.trim().length === 0 || chainBlocked}
            className="min-h-11 rounded-panel bg-biolume px-4 text-sm font-medium text-void disabled:opacity-40"
          >
            {running ? "Attesting" : chain === "checking" ? "Reading" : "Attest"}
          </button>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setIntent(preset.intent);
                  if (preset.phase !== undefined) setPhase(preset.phase);
                }}
                className="min-h-11 rounded-full border border-line px-3 text-xs text-foam"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div>
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="phase" className="text-xs tracking-widest text-mist uppercase">
                Vessel phase · {phaseName(phase)}
              </label>
              <p className="text-sm text-foam">
                t {phase.toFixed(2)} · ease {easeNow.toFixed(3)}
              </p>
            </div>
            <input
              id="phase"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={phase}
              onChange={(event) => setPhase(Number(event.target.value))}
              aria-valuetext={`${phaseName(phase)}, t ${phase.toFixed(2)}`}
            />
            <EaseCurve t={phase} />
            <div className="flex justify-between text-xs tracking-widest text-mist uppercase">
              <span>Sprout</span>
              <span>Bloom</span>
              <span>Wilt</span>
            </div>
            <p className="mt-2 text-xs text-mist">{EASE_LAW}</p>
          </div>
          <p className="font-display text-lg leading-snug text-foam">{SOUL_LINE}</p>
        </section>

        <section className="flex min-h-0 min-w-0 flex-col gap-5 px-4 py-5 sm:px-6 lg:col-start-3 lg:row-start-1 lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs tracking-widest text-mist uppercase">Omega gate</p>
            <button
              type="button"
              onClick={() => void copyReceipt()}
              disabled={!receipt}
              className="min-h-11 rounded-full border border-line px-3 text-xs text-foam disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy receipt"}
            </button>
          </div>
          <p className={`font-display text-3xl ${tone(receipt?.status ?? null)}`}>
            {running ? "READING" : (receipt?.status ?? "AWAITING")}
          </p>
          {plan ? (
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
              <dt className="text-mist">Expected</dt>
              <dd className="break-all text-foam">{plan.expected}</dd>
              <dt className="text-mist">Observed</dt>
              <dd className="break-all text-foam">{plan.observed}</dd>
            </dl>
          ) : (
            <p className="text-sm text-mist">
              The receipt appears only after a real comparison. Remote limbs stay unknown.
            </p>
          )}
          {receipt ? (
            <>
              <pre className="overflow-x-auto rounded-panel border border-line bg-void p-4 text-xs leading-relaxed break-all whitespace-pre-wrap text-foam">
                {JSON.stringify(receipt, null, 2)}
              </pre>
              <p className="text-xs text-mist">Evidence is the SHA-256 of the observed string.</p>
              <p className="text-sm text-mist">
                <span className="tracking-widest uppercase">Next Δ · </span>
                {receipt.next_delta}
              </p>
            </>
          ) : null}
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs tracking-widest text-mist uppercase">KAI ledger</p>
            <button
              type="button"
              onClick={downloadLedger}
              className="min-h-11 rounded-full border border-line px-3 text-xs text-foam"
            >
              Export
            </button>
          </div>
          <p className={`text-sm ${chain === "broken" || chain === "corrupt" ? "text-iris" : "text-mist"}`}>
            {chain === "checking" && "Reading the chain."}
            {chain === "empty" && `Empty. Genesis ${GENESIS} waits for the first seal.`}
            {chain === "intact" && `${ledger.length} sealed. Chain intact.`}
            {chain === "broken" &&
              `Chain diverges at entry ${(brokenAt ?? 0) + 1}. Left untouched. No new seal.`}
            {chain === "corrupt" && "Ledger bytes are not a valid document. Left untouched."}
          </p>
          <ol className="flex flex-col gap-3">
            {[...ledger].reverse().map((entry) => (
              <li key={entry.entry_hash} className="border-t border-line pt-3">
                <p className={`text-xs tracking-widest uppercase ${tone(entry.status)}`}>
                  {entry.status} · {entry.tool_used}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-foam">{entry.intent}</p>
                <p className="mt-1 text-xs break-all text-mist">{entry.entry_hash}</p>
              </li>
            ))}
          </ol>
          <p className="text-xs text-mist">{DOCTRINE}</p>
        </section>
      </div>
    </div>
  );
}
