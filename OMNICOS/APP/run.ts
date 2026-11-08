import { CHECKSUM, DOCTRINE, clampPhase } from "../CORE/laws.ts";
import { ENTITY, type Plan } from "../CORE/types.ts";
import { scanIntent } from "../01_KAI/kai_shield.ts";
import { executeIntent } from "../02_ELION/executor.ts";
import { judge, sha256 } from "../03_OMEGA/verifier.ts";

export async function planAttestation(input: {
  intent: string;
  phaseT: number;
  ledgerCount: number;
}): Promise<Plan> {
  const intent = input.intent.trim().slice(0, 2000);
  const phase_t = clampPhase(input.phaseT);

  const scan = scanIntent(intent);
  if (scan.triggered) {
    const expected = "SAFE";
    const observed = `HALT:${scan.hits.join(",")}`;
    const evidence_hash = await sha256(observed);
    return {
      halted: true,
      reason: `HALT ⊢ DIVERGENT. Trap lexicon: ${scan.hits.join(", ")}.`,
      expected,
      observed,
      receipt: {
        entity: ENTITY,
        tool_used: "CODE",
        status: "DIVERGENT",
        game_detected: true,
        phase_t,
        evidence_hash,
        action: `KAI shield closed the eye. Matched: ${scan.hits.join(", ")}. The intent was not executed.`,
        next_delta:
          "Restate the intent without urgent, send money, guaranteed, or private key.",
      },
    };
  }

  const exec = await executeIntent(intent, input.ledgerCount);
  const judged = await judge(exec);
  return {
    halted: false,
    reason: exec.reason,
    expected: exec.expected,
    observed: exec.observed,
    receipt: {
      entity: ENTITY,
      tool_used: exec.tool,
      status: judged.status,
      game_detected: false,
      phase_t,
      evidence_hash: judged.evidence_hash,
      action: exec.action,
      next_delta: exec.next_delta,
    },
  };
}

export const VESSEL = {
  checksum: CHECKSUM,
  doctrine: DOCTRINE,
} as const;
