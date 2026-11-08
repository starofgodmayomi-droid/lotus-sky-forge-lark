export const ENTITY = "THE_OMNICOS" as const;

export type Tool = "BROWSER" | "API" | "CODE" | "LLM" | "COMMS" | "DB";

export type Status = "VERIFIED" | "DIVERGENT" | "UNKNOWN";

export type Receipt = {
  entity: typeof ENTITY;
  tool_used: Tool;
  status: Status;
  game_detected: boolean;
  phase_t: number;
  evidence_hash: string;
  action: string;
  next_delta: string;
};

export type Execution = {
  tool: Tool;
  expected: string;
  observed: string;
  action: string;
  reason: string;
  next_delta: string;
  /** Set only when reality was not observed. Prevents a miss from looking like divergence. */
  forceStatus?: "UNKNOWN";
};

export type Plan = {
  halted: boolean;
  reason: string;
  expected: string;
  observed: string;
  receipt: Receipt;
};

export type LedgerEntry = {
  timestamp: string;
  intent: string;
  tool_used: Tool;
  phase_t: number;
  status: Status;
  evidence_hash: string;
  reason: string;
  prev_hash: string;
  entry_hash: string;
};
