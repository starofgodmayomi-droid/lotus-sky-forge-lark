import type { Tool } from "../CORE/types.ts";

export type RemoteLimb = {
  tool: Tool;
  name: string;
  action: string;
  next_delta: string;
};

/**
 * Remote limbs are classified, never invented.
 * This vessel has no live browser, API, comms, or Ollama channel.
 * Returning content from those limbs would be a fabricated completion.
 */
export function classifyRemote(intent: string): RemoteLimb | null {
  const s = intent.toLowerCase();

  if (/\b(browse|scrape|website|url|https?:\/\/|web for|search the web)\b/.test(s)) {
    return {
      tool: "BROWSER",
      name: "browser",
      action:
        "Browser limb classified the intent. No page was fetched. No DOM was claimed.",
      next_delta: "Ask for a local attestation: checksum, ease, hash, soul, or ledger.",
    };
  }

  if (/\b(stripe|github|tradingview|composio|webhook|api)\b/.test(s)) {
    return {
      tool: "API",
      name: "api",
      action:
        "API limb classified the intent. No request was sent. No payload was invented.",
      next_delta: "Keep the call unsent. Attest a local fact, or leave the limb dark.",
    };
  }

  if (/\b(email|sms|telegram|dm|message|inbox)\b/.test(s)) {
    return {
      tool: "COMMS",
      name: "comms",
      action: "Comms limb classified the intent. No message was sent.",
      next_delta: "Do not send. Restate as a local memory if it should be remembered.",
    };
  }

  if (/\b(ollama|llama|weather|news|price|stock|headline)\b/.test(s)) {
    return {
      tool: "LLM",
      name: "ollama",
      action:
        "Remote cognition was requested. This vessel has no Ollama channel. No answer was composed.",
      next_delta: "Ask something the sealed texts can answer: soul, fixpoint, or doctrine.",
    };
  }

  return null;
}
