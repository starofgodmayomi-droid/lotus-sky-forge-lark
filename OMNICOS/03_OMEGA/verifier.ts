import type { Execution, Status } from "../CORE/types.ts";

/** Biological growth curve. Sprout → bloom → wilt. Slow at the ends, full in the middle. */
export function ease(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return (1 - Math.cos(x * Math.PI)) / 2;
}

/** Independent formulation: sin²(t·π/2) ≡ (1 − cos(t·π)) / 2. */
export function easeIdentity(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  const s = Math.sin((x * Math.PI) / 2);
  return s * s;
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function judge(exec: Execution): Promise<{ status: Status; evidence_hash: string }> {
  let status: Status;
  if (exec.forceStatus) status = exec.forceStatus;
  else if (exec.expected === exec.observed) status = "VERIFIED";
  else status = "DIVERGENT";
  const evidence_hash = await sha256(exec.observed);
  return { status, evidence_hash };
}
