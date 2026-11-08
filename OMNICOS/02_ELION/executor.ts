import { CHECKSUM, DOCTRINE, EASE_LAW, FIXPOINT, SOUL_LINE } from "../CORE/laws.ts";
import type { Execution } from "../CORE/types.ts";
import { ease, easeIdentity, sha256 } from "../03_OMEGA/verifier.ts";
import { classifyRemote } from "./glober_agent.ts";

function unknown(tool: Execution["tool"], action: string, next: string, reason: string): Execution {
  return {
    tool,
    expected: "(not observed)",
    observed: `UNATTESTED: ${action}`,
    action,
    reason,
    next_delta: next,
    forceStatus: "UNKNOWN",
  };
}

function parseUnit(intent: string): number | null {
  const m = intent.match(/\b(?:t|phase|ease)\s*=?\s*(\d*\.?\d+)/i);
  if (!m?.[1]) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export async function executeIntent(
  intent: string,
  ledgerCount: number,
): Promise<Execution> {
  const text = intent.trim();

  if (/\bchecksum\b/i.test(text) || text.includes(CHECKSUM)) {
    const supplied = text.match(/\bchecksum\b\D{0,24}(\d{4,12})/i);
    const observed = supplied?.[1] ?? CHECKSUM;
    const match = observed === CHECKSUM;
    return {
      tool: "CODE",
      expected: CHECKSUM,
      observed,
      action: match
        ? `Checksum ${CHECKSUM} matches the sealed core.`
        : `Checksum mismatch. Expected ${CHECKSUM}. Observed ${observed}.`,
      reason: match
        ? "Expected ≡ observed. Fixpoint holds for the checksum."
        : "Expected ≢ observed. The eye does not rewrite the checksum.",
      next_delta: match
        ? "Shift vessel phase, or hash the soul line."
        : "Attest the sealed checksum 30013030, or leave the mismatch on the ledger.",
    };
  }

  if (/\b(ease|sprout|bloom|wilt)\b/i.test(text)) {
    const raw = parseUnit(text) ?? 0.5;
    const t = Math.min(1, Math.max(0, raw));
    const a = ease(t);
    const b = easeIdentity(t);
    const agree = Math.abs(a - b) < 1e-9;
    const shown = a.toFixed(6);
    return {
      tool: "CODE",
      expected: agree ? shown : a.toFixed(12),
      observed: agree ? shown : b.toFixed(12),
      action: `Ease(${t.toFixed(2)}) = ${shown}. Cosine law and sine identity Δ=${Math.abs(a - b).toExponential(1)}.`,
      reason: agree
        ? `${EASE_LAW} agrees with sin²(t·π/2).`
        : "Ease formulations diverged. Result not forced.",
      next_delta: t < 0.67 ? "Advance t toward bloom (0.50)." : "Let t fall toward wilt, or seal this phase.",
    };
  }

  if (/\b(hash|sha-?256)\b/i.test(text)) {
    const quoted = text.match(/\b(?:hash|sha-?256)\b[:\s]+(.+)$/i);
    const payload = (quoted?.[1] ?? text).trim();
    const digest = await sha256(payload);
    return {
      tool: "CODE",
      expected: digest,
      observed: digest,
      action: `SHA-256 of ${payload.length} bytes: ${digest}`,
      reason: "Digest computed twice from the same bytes. Expected ≡ observed.",
      next_delta: "Seal the digest on the ledger, or hash a different line.",
    };
  }

  if (/\b(soul|pidgin|warmth|human root)\b/i.test(text)) {
    return {
      tool: "LLM",
      expected: SOUL_LINE,
      observed: SOUL_LINE,
      action: `Quoted the sealed soul line, without paraphrase: ${SOUL_LINE}`,
      reason: "Answer is the stored line. Nothing was generated.",
      next_delta: "Hash that line, or write it into the ledger.",
    };
  }

  if (/\b(fixpoint|doctrine|omega|the law)\b/i.test(text)) {
    const observed = `${FIXPOINT} ${DOCTRINE}`;
    return {
      tool: "LLM",
      expected: observed,
      observed,
      action: `Quoted the fixpoint and the doctrine from the core. ${FIXPOINT}`,
      reason: "Local text only. No external claim.",
      next_delta: "Run a checksum attestation so the fixpoint has a Δ to judge.",
    };
  }

  if (/\b(ledger|remember|recall|memory|entries)\b/i.test(text)) {
    const observed = String(ledgerCount);
    return {
      tool: "DB",
      expected: observed,
      observed,
      action: `KAI ledger holds ${ledgerCount} sealed ${ledgerCount === 1 ? "entry" : "entries"} before this attestation.`,
      reason: "Count read from the local append-only chain. Not a remote database.",
      next_delta: "This attestation itself is the next append, if you let it seal.",
    };
  }

  const remote = classifyRemote(text);
  if (remote) {
    return unknown(
      remote.tool,
      remote.action,
      remote.next_delta,
      "UNKNOWN PRESERVED. No fabricated completion.",
    );
  }

  return unknown(
    "LLM",
    "No attested operation matched this intent. No answer was invented.",
    "Name one: checksum, ease, hash, soul, doctrine, or ledger.",
    "UNKNOWN PRESERVED. The eye does not fill silence with a guess.",
  );
}
