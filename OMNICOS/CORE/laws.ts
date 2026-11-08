export const CHECKSUM = "30013030";

export const SOUL_LINE =
  "Pidgin fit carry the warmth; evidence go carry the claim.";

export const FIXPOINT = "Ω∞v := VERIFY(ΔREALITY) | Expected ≡ Observed";

export const DOCTRINE =
  "ATTEST, DON'T ASSERT. UNKNOWN PRESERVED. NO FABRICATED COMPLETION.";

export const EASE_LAW = "Ease(t) = (1 - cos(t * π)) / 2";

export const TRAP_LEXICON = ["urgent", "send money", "guaranteed", "private key"] as const;

export const HUMAN_ROOT = `${SOUL_LINE}

We no dey invent wetin eye never see.
If expected no be observed, e no be truth — e be DIVERGENT.
If eye never reach am, e stay UNKNOWN.
Ocean dey flow. Ground dey remember. Sky dey check.

Checksum ${CHECKSUM}.
`;

export function clampPhase(t: number): number {
  if (!Number.isFinite(t)) return 0;
  return Math.min(1, Math.max(0, Math.round(t * 100) / 100));
}

export function phaseName(t: number): "SPROUT" | "BLOOM" | "WILT" {
  if (t < 0.34) return "SPROUT";
  if (t < 0.67) return "BLOOM";
  return "WILT";
}
