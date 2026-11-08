import { TRAP_LEXICON } from "../CORE/laws.ts";

export type ShieldScan = {
  triggered: boolean;
  hits: string[];
};

function phrasePattern(phrase: string): RegExp {
  const body = phrase
    .split(" ")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return new RegExp(`(?:^|\\b)${body}(?:\\b|$)`, "i");
}

const PATTERNS = TRAP_LEXICON.map((phrase) => ({
  phrase,
  re: phrasePattern(phrase),
}));

/** KAI shield. Scans the intent for the game's trap lexicon. Does not execute it. */
export function scanIntent(intent: string): ShieldScan {
  const text = intent.toLowerCase().replace(/\s+/g, " ").trim();
  const hits = PATTERNS.filter(({ re }) => re.test(text)).map(({ phrase }) => phrase);
  return { triggered: hits.length > 0, hits };
}
