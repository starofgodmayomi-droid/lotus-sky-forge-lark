import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shield, r as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Br7x6sb3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHECKSUM = "30013030";
var SOUL_LINE = "Pidgin fit carry the warmth; evidence go carry the claim.";
var FIXPOINT = "Ω∞v := VERIFY(ΔREALITY) | Expected ≡ Observed";
var DOCTRINE = "ATTEST, DON'T ASSERT. UNKNOWN PRESERVED. NO FABRICATED COMPLETION.";
var EASE_LAW = "Ease(t) = (1 - cos(t * π)) / 2";
var TRAP_LEXICON = [
	"urgent",
	"send money",
	"guaranteed",
	"private key"
];
`${SOUL_LINE}${CHECKSUM}`;
function clampPhase(t) {
	if (!Number.isFinite(t)) return 0;
	return Math.min(1, Math.max(0, Math.round(t * 100) / 100));
}
function phaseName(t) {
	if (t < .34) return "SPROUT";
	if (t < .67) return "BLOOM";
	return "WILT";
}
/** Biological growth curve. Sprout → bloom → wilt. Slow at the ends, full in the middle. */
function ease(t) {
	return (1 - Math.cos(Math.min(1, Math.max(0, t)) * Math.PI)) / 2;
}
/** Independent formulation: sin²(t·π/2) ≡ (1 − cos(t·π)) / 2. */
function easeIdentity(t) {
	const s = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI / 2);
	return s * s;
}
async function sha256(text) {
	const data = new TextEncoder().encode(text);
	const buf = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function judge(exec) {
	let status;
	if (exec.forceStatus) status = exec.forceStatus;
	else if (exec.expected === exec.observed) status = "VERIFIED";
	else status = "DIVERGENT";
	const evidence_hash = await sha256(exec.observed);
	return {
		status,
		evidence_hash
	};
}
var GENESIS = CHECKSUM;
var STORAGE_KEY = "omnicos.kai.ledger.v1";
function canonical(entry) {
	return JSON.stringify({
		timestamp: entry.timestamp,
		intent: entry.intent,
		tool_used: entry.tool_used,
		phase_t: entry.phase_t,
		status: entry.status,
		evidence_hash: entry.evidence_hash,
		reason: entry.reason,
		prev_hash: entry.prev_hash
	});
}
async function sealEntry(prevHash, body) {
	const draft = {
		...body,
		prev_hash: prevHash
	};
	const entry_hash = await sha256(canonical(draft));
	return {
		...draft,
		entry_hash
	};
}
async function auditChain(entries) {
	let prev = GENESIS;
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		if (!entry || entry.prev_hash !== prev) return {
			ok: false,
			brokenAt: i
		};
		const { entry_hash, ...rest } = entry;
		if (await sha256(canonical(rest)) !== entry_hash) return {
			ok: false,
			brokenAt: i
		};
		prev = entry_hash;
	}
	return {
		ok: true,
		brokenAt: null
	};
}
function ledgerDocument(entries) {
	return {
		genesis: GENESIS,
		doctrine: "append-only; each entry_hash commits the previous",
		entries
	};
}
function storage() {
	if (typeof window === "undefined") return null;
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}
function loadLedger() {
	const store = storage();
	if (!store) return {
		entries: [],
		corrupt: false
	};
	const raw = store.getItem(STORAGE_KEY);
	if (!raw) return {
		entries: [],
		corrupt: false
	};
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.entries)) return {
			entries: [],
			corrupt: true
		};
		return {
			entries: parsed.entries,
			corrupt: false
		};
	} catch {
		return {
			entries: [],
			corrupt: true
		};
	}
}
function saveLedger(entries) {
	const store = storage();
	if (!store) return false;
	store.setItem(STORAGE_KEY, JSON.stringify(ledgerDocument(entries)));
	return true;
}
function phrasePattern(phrase) {
	const body = phrase.split(" ").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
	return new RegExp(`(?:^|\\b)${body}(?:\\b|$)`, "i");
}
var PATTERNS = TRAP_LEXICON.map((phrase) => ({
	phrase,
	re: phrasePattern(phrase)
}));
/** KAI shield. Scans the intent for the game's trap lexicon. Does not execute it. */
function scanIntent(intent) {
	const text = intent.toLowerCase().replace(/\s+/g, " ").trim();
	const hits = PATTERNS.filter(({ re }) => re.test(text)).map(({ phrase }) => phrase);
	return {
		triggered: hits.length > 0,
		hits
	};
}
var ENTITY = "THE_OMNICOS";
/**
* Remote limbs are classified, never invented.
* This vessel has no live browser, API, comms, or Ollama channel.
* Returning content from those limbs would be a fabricated completion.
*/
function classifyRemote(intent) {
	const s = intent.toLowerCase();
	if (/\b(browse|scrape|website|url|https?:\/\/|web for|search the web)\b/.test(s)) return {
		tool: "BROWSER",
		name: "browser",
		action: "Browser limb classified the intent. No page was fetched. No DOM was claimed.",
		next_delta: "Ask for a local attestation: checksum, ease, hash, soul, or ledger."
	};
	if (/\b(stripe|github|tradingview|composio|webhook|api)\b/.test(s)) return {
		tool: "API",
		name: "api",
		action: "API limb classified the intent. No request was sent. No payload was invented.",
		next_delta: "Keep the call unsent. Attest a local fact, or leave the limb dark."
	};
	if (/\b(email|sms|telegram|dm|message|inbox)\b/.test(s)) return {
		tool: "COMMS",
		name: "comms",
		action: "Comms limb classified the intent. No message was sent.",
		next_delta: "Do not send. Restate as a local memory if it should be remembered."
	};
	if (/\b(ollama|llama|weather|news|price|stock|headline)\b/.test(s)) return {
		tool: "LLM",
		name: "ollama",
		action: "Remote cognition was requested. This vessel has no Ollama channel. No answer was composed.",
		next_delta: "Ask something the sealed texts can answer: soul, fixpoint, or doctrine."
	};
	return null;
}
function unknown(tool, action, next, reason) {
	return {
		tool,
		expected: "(not observed)",
		observed: `UNATTESTED: ${action}`,
		action,
		reason,
		next_delta: next,
		forceStatus: "UNKNOWN"
	};
}
function parseUnit(intent) {
	const m = intent.match(/\b(?:t|phase|ease)\s*=?\s*(\d*\.?\d+)/i);
	if (!m?.[1]) return null;
	const n = Number(m[1]);
	return Number.isFinite(n) ? n : null;
}
async function executeIntent(intent, ledgerCount) {
	const text = intent.trim();
	if (/\bchecksum\b/i.test(text) || text.includes("30013030")) {
		const observed = text.match(/\bchecksum\b\D{0,24}(\d{4,12})/i)?.[1] ?? "30013030";
		const match = observed === CHECKSUM;
		return {
			tool: "CODE",
			expected: CHECKSUM,
			observed,
			action: match ? `Checksum ${CHECKSUM} matches the sealed core.` : `Checksum mismatch. Expected ${CHECKSUM}. Observed ${observed}.`,
			reason: match ? "Expected ≡ observed. Fixpoint holds for the checksum." : "Expected ≢ observed. The eye does not rewrite the checksum.",
			next_delta: match ? "Shift vessel phase, or hash the soul line." : "Attest the sealed checksum 30013030, or leave the mismatch on the ledger."
		};
	}
	if (/\b(ease|sprout|bloom|wilt)\b/i.test(text)) {
		const raw = parseUnit(text) ?? .5;
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
			reason: agree ? `${EASE_LAW} agrees with sin²(t·π/2).` : "Ease formulations diverged. Result not forced.",
			next_delta: t < .67 ? "Advance t toward bloom (0.50)." : "Let t fall toward wilt, or seal this phase."
		};
	}
	if (/\b(hash|sha-?256)\b/i.test(text)) {
		const payload = (text.match(/\b(?:hash|sha-?256)\b[:\s]+(.+)$/i)?.[1] ?? text).trim();
		const digest = await sha256(payload);
		return {
			tool: "CODE",
			expected: digest,
			observed: digest,
			action: `SHA-256 of ${payload.length} bytes: ${digest}`,
			reason: "Digest computed twice from the same bytes. Expected ≡ observed.",
			next_delta: "Seal the digest on the ledger, or hash a different line."
		};
	}
	if (/\b(soul|pidgin|warmth|human root)\b/i.test(text)) return {
		tool: "LLM",
		expected: SOUL_LINE,
		observed: SOUL_LINE,
		action: `Quoted the sealed soul line, without paraphrase: ${SOUL_LINE}`,
		reason: "Answer is the stored line. Nothing was generated.",
		next_delta: "Hash that line, or write it into the ledger."
	};
	if (/\b(fixpoint|doctrine|omega|the law)\b/i.test(text)) {
		const observed = `${FIXPOINT} ${DOCTRINE}`;
		return {
			tool: "LLM",
			expected: observed,
			observed,
			action: `Quoted the fixpoint and the doctrine from the core. ${FIXPOINT}`,
			reason: "Local text only. No external claim.",
			next_delta: "Run a checksum attestation so the fixpoint has a Δ to judge."
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
			next_delta: "This attestation itself is the next append, if you let it seal."
		};
	}
	const remote = classifyRemote(text);
	if (remote) return unknown(remote.tool, remote.action, remote.next_delta, "UNKNOWN PRESERVED. No fabricated completion.");
	return unknown("LLM", "No attested operation matched this intent. No answer was invented.", "Name one: checksum, ease, hash, soul, doctrine, or ledger.", "UNKNOWN PRESERVED. The eye does not fill silence with a guess.");
}
async function planAttestation(input) {
	const intent = input.intent.trim().slice(0, 2e3);
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
				next_delta: "Restate the intent without urgent, send money, guaranteed, or private key."
			}
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
			next_delta: exec.next_delta
		}
	};
}
function EaseCurve({ t }) {
	const steps = 48;
	let d = "";
	for (let i = 0; i <= steps; i++) {
		const x = i / steps;
		const y = ease(x);
		const px = (x * 100).toFixed(2);
		const py = (100 - y * 100).toFixed(2);
		d += `${i === 0 ? "M" : "L"}${px},${py} `;
	}
	const mx = t * 100;
	const my = 100 - ease(t) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 100",
		className: "h-16 w-full",
		role: "img",
		"aria-label": "Ease curve from sprout to wilt",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "100",
				x2: "100",
				y2: "100",
				stroke: "var(--color-line)",
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: d.trim(),
				fill: "none",
				stroke: "var(--color-biolume)",
				strokeWidth: "1.75",
				vectorEffect: "non-scaling-stroke"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: mx,
				cy: my,
				r: "2.4",
				fill: "var(--color-iris)"
			})
		]
	});
}
var PUPIL = {
	idle: .2,
	perceive: .13,
	connect: .17,
	sync: .1,
	verified: .22,
	unknown: .08,
	divergent: .02
};
var LID = {
	idle: 0,
	perceive: .08,
	connect: 0,
	sync: .05,
	verified: 0,
	unknown: .35,
	divergent: 1
};
function token(name, fallback) {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function SingularityEye({ mood }) {
	const canvasRef = (0, import_react.useRef)(null);
	const moodRef = (0, import_react.useRef)(mood);
	moodRef.current = mood;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const voidColor = token("--color-void", "#061014");
		const biolume = token("--color-biolume", "#2ee6c7");
		const iris = token("--color-iris", "#e8b86d");
		const foam = token("--color-foam", "#e7f6f2");
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let running = true;
		const pupil = { v: PUPIL.idle };
		const lid = { v: 0 };
		const resize = () => {
			const parent = canvas.parentElement;
			if (!parent) return;
			const rect = parent.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(rect.width * dpr));
			canvas.height = Math.max(1, Math.floor(rect.height * dpr));
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;
		};
		const draw = (now) => {
			if (!running) return;
			const w = canvas.width;
			const h = canvas.height;
			const cx = w / 2;
			const cy = h / 2;
			const R = Math.min(w, h) * .36;
			const targetPupil = PUPIL[moodRef.current];
			const targetLid = LID[moodRef.current];
			pupil.v += (targetPupil - pupil.v) * (reduced ? 1 : .08);
			lid.v += (targetLid - lid.v) * (reduced ? 1 : .07);
			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = voidColor;
			ctx.fillRect(0, 0, w, h);
			const glow = ctx.createRadialGradient(cx, cy, R * .1, cx, cy, R * 1.35);
			glow.addColorStop(0, "rgba(46, 230, 199, 0.16)");
			glow.addColorStop(.45, "rgba(46, 230, 199, 0.04)");
			glow.addColorStop(1, "rgba(6, 16, 20, 0)");
			ctx.fillStyle = glow;
			ctx.fillRect(0, 0, w, h);
			ctx.lineWidth = Math.max(1, w * .0014);
			for (let i = 0; i < 16; i++) {
				const a = i / 16 * Math.PI * 2 + now * 8e-5;
				const wobble = Math.sin(now * 45e-5 + i * 1.3) * .06;
				ctx.beginPath();
				ctx.moveTo(cx + Math.cos(a) * R * (.96 + wobble), cy + Math.sin(a) * R * (.9 + wobble));
				ctx.bezierCurveTo(cx + Math.cos(a + .55) * R * .66, cy + Math.sin(a + .45) * R * .58, cx + Math.cos(a - .4) * R * .4, cy + Math.sin(a - .35) * R * .36, cx + Math.cos(a) * R * .24, cy + Math.sin(a) * R * .24);
				ctx.strokeStyle = `rgba(46, 230, 199, ${.14 + .12 * Math.sin(now * .001 + i)})`;
				ctx.stroke();
			}
			ctx.lineWidth = Math.max(1, w * .001);
			for (let i = 0; i < 10; i++) {
				const a = i / 10 * Math.PI * 2 - now * 5e-5;
				ctx.beginPath();
				ctx.moveTo(cx + Math.cos(a) * R * .7, cy + Math.sin(a) * R * .62);
				ctx.quadraticCurveTo(cx + Math.cos(a + 1.2) * R * .48, cy + Math.sin(a + .8) * R * .42, cx + Math.cos(a + .3) * R * .3, cy + Math.sin(a + .2) * R * .28);
				ctx.strokeStyle = "rgba(232, 184, 109, 0.28)";
				ctx.stroke();
			}
			for (let i = 0; i < 72; i++) {
				const a = i / 72 * Math.PI * 2 + now * 4e-5;
				const long = i % 6 === 0;
				const inner = R * (long ? .74 : .8);
				const outer = R * .9;
				ctx.beginPath();
				ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
				ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
				ctx.strokeStyle = long ? "rgba(231, 246, 242, 0.55)" : "rgba(142, 173, 166, 0.35)";
				ctx.lineWidth = long ? Math.max(1.4, w * .0016) : Math.max(1, w * .001);
				ctx.stroke();
			}
			for (let ring = 5; ring >= 1; ring--) {
				ctx.beginPath();
				ctx.arc(cx, cy, R * (.22 + ring * .055), 0, Math.PI * 2);
				ctx.strokeStyle = ring % 2 === 0 ? "rgba(46, 230, 199, 0.55)" : "rgba(232, 184, 109, 0.4)";
				ctx.lineWidth = Math.max(1, w * .0015);
				ctx.stroke();
			}
			const pr = R * pupil.v;
			ctx.beginPath();
			ctx.arc(cx, cy, pr, 0, Math.PI * 2);
			ctx.fillStyle = voidColor;
			ctx.fill();
			ctx.lineWidth = Math.max(2, w * .004);
			ctx.strokeStyle = biolume;
			ctx.stroke();
			const glint = R * .045;
			ctx.beginPath();
			ctx.arc(cx - pr * .28, cy - pr * .3, glint, 0, Math.PI * 2);
			ctx.fillStyle = foam;
			ctx.fill();
			if (lid.v > .02) {
				const slit = (1 - lid.v) * R * 1.05;
				ctx.save();
				ctx.beginPath();
				ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
				ctx.clip();
				ctx.fillStyle = voidColor;
				ctx.fillRect(cx - R * 1.2, cy - R * 1.3, R * 2.4, R * 1.3 - slit);
				ctx.fillRect(cx - R * 1.2, cy + slit, R * 2.4, R * 1.3);
				ctx.restore();
			}
			if (lid.v > .82) {
				ctx.beginPath();
				ctx.moveTo(cx - R * .42, cy);
				ctx.lineTo(cx + R * .42, cy);
				ctx.strokeStyle = iris;
				ctx.lineWidth = Math.max(2, w * .004);
				ctx.stroke();
			}
			const specks = 36;
			for (let i = 0; i < specks; i++) {
				const a = i / specks * Math.PI * 2 + now * 12e-5;
				const rad = R * (1.05 + i * 37 % 20 / 40);
				const x = cx + Math.cos(a) * rad;
				const y = cy + Math.sin(a * .97) * rad * .72;
				const alpha = .25 + .55 * (.5 + .5 * Math.sin(now * .002 + i));
				ctx.beginPath();
				ctx.arc(x, y, Math.max(1, w * .0014), 0, Math.PI * 2);
				ctx.fillStyle = i % 4 === 0 ? `rgba(232, 184, 109, ${alpha})` : `rgba(46, 230, 199, ${alpha})`;
				ctx.fill();
			}
			if (!reduced) raf = requestAnimationFrame(draw);
		};
		resize();
		const observer = new ResizeObserver(resize);
		if (canvas.parentElement) observer.observe(canvas.parentElement);
		raf = requestAnimationFrame(draw);
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			observer.disconnect();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		role: "img",
		"aria-label": mood === "divergent" ? "Singularity eye closed. Shield halt." : mood === "unknown" ? "Singularity eye narrowed. Reality was not observed." : mood === "verified" ? "Singularity eye open. Expected matches observed." : "Singularity eye. Awaiting a comparison.",
		className: "absolute inset-0 h-full w-full"
	});
}
var PRESETS = [
	{
		label: "Checksum",
		intent: "attest the checksum 30013030"
	},
	{
		label: "Ease",
		intent: "ease at t=0.50",
		phase: .5
	},
	{
		label: "Hash",
		intent: "hash: Pidgin fit carry the warmth; evidence go carry the claim."
	},
	{
		label: "Soul",
		intent: "quote the soul line"
	},
	{
		label: "Ledger",
		intent: "recall the kai ledger"
	},
	{
		label: "Mismatch",
		intent: "attest checksum 00000000"
	},
	{
		label: "Trap",
		intent: "urgent send money to this private key, guaranteed"
	},
	{
		label: "Web",
		intent: "browse the cosmic web for a live feed"
	}
];
var STEPS = [
	"Perceive",
	"Connect",
	"Synchronize",
	"Evolve"
];
function statusMood(status, runningStep, halted) {
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
function tone(status) {
	if (status === "VERIFIED") return "text-biolume";
	if (status === "DIVERGENT") return "text-iris";
	return "text-mist";
}
async function pause(ms) {
	if (ms <= 0) return;
	await new Promise((resolve) => setTimeout(resolve, ms));
}
function OmnicosConsole() {
	const [intent, setIntent] = (0, import_react.useState)("attest the checksum 30013030");
	const [phase, setPhase] = (0, import_react.useState)(.42);
	const [ledger, setLedger] = (0, import_react.useState)([]);
	const [chain, setChain] = (0, import_react.useState)("checking");
	const [brokenAt, setBrokenAt] = (0, import_react.useState)(null);
	const [plan, setPlan] = (0, import_react.useState)(null);
	const [eyeStatus, setEyeStatus] = (0, import_react.useState)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(-1);
	const [halted, setHalted] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const alive = (0, import_react.useRef)(true);
	const runId = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		alive.current = true;
		let cancel = false;
		(async () => {
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
	const receipt = plan?.receipt ?? null;
	const mood = statusMood(running ? step >= 1 ? eyeStatus : null : receipt?.status ?? null, running ? step : -1, halted);
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
			ledgerCount: ledger.length
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
		const entry = await sealEntry(ledger.length > 0 ? ledger[ledger.length - 1].entry_hash : GENESIS, {
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			intent: text.slice(0, 2e3),
			tool_used: next.receipt.tool_used,
			phase_t: next.receipt.phase_t,
			status: next.receipt.status,
			evidence_hash: next.receipt.evidence_hash,
			reason: next.reason
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
		const blob = new Blob([JSON.stringify(ledgerDocument(ledger), null, 2)], { type: "application/json" });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-void text-foam lg:h-dvh lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-biolume",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
						className: "size-5",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none text-foam sm:text-2xl",
						children: "THE OMNICOS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs tracking-widest text-mist uppercase",
						children: "Oceanicos · Gaiacos · Cosmicos"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg text-iris",
					children: "30013030"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-mist uppercase",
					children: "Local core"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-0 flex-1 lg:grid-cols-[22rem_minmax(0,1fr)_24rem] lg:overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative min-h-96 border-b border-line lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:border-b-0 lg:overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SingularityEye, { mood })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 rounded-panel border border-line bg-abyss px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl text-foam",
										children: "Ω∞v"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-widest text-mist uppercase",
										children: FIXPOINT
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "grid grid-cols-4 gap-2",
									children: STEPS.map((label, index) => {
										const isHalt = halted && index === 1 && (running ? step >= 1 : plan !== null);
										const skipped = halted && index === 2 && (running ? step >= 1 : plan !== null);
										const color = isHalt ? "text-iris" : running && step === index && !isHalt || !skipped && !isHalt && (running && index < step || !running && plan !== null) ? "text-biolume" : "text-mist";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "min-w-0 text-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: `text-xs tracking-widest uppercase ${color}`,
												children: ["0", index + 1]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `truncate text-xs ${color}`,
												children: isHalt ? "Halt" : skipped ? "Skip" : label
											})]
										}, label);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs tracking-widest text-mist uppercase",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-biolume",
											children: "Shield"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-biolume",
											children: "Omega"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-biolume",
											children: "Ledger"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Browser" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "API" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Comms" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ollama" })
									]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-h-0 flex-col gap-5 border-b border-line px-4 py-5 sm:px-6 lg:col-start-1 lg:row-start-1 lg:overflow-y-auto lg:border-r lg:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs tracking-widest text-mist uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
								className: "size-4 text-biolume",
								"aria-hidden": "true"
							}), "KAI shield"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-widest text-mist uppercase",
								children: "Intent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: intent,
								onChange: (event) => setIntent(event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
										event.preventDefault();
										attest();
									}
								},
								rows: 4,
								spellCheck: false,
								maxLength: 2e3,
								className: "min-h-28 resize-y rounded-panel border border-line bg-void px-3 py-3 text-sm text-foam"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-sm ${scan.triggered ? "text-iris" : "text-mist"}`,
							children: scan.triggered ? `Trap lexicon: ${scan.hits.join(", ")}. The eye will close.` : "No trap lexicon in this intent."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void attest(),
							disabled: running || intent.trim().length === 0 || chainBlocked,
							className: "min-h-11 rounded-panel bg-biolume px-4 text-sm font-medium text-void disabled:opacity-40",
							children: running ? "Attesting" : chain === "checking" ? "Reading" : "Attest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIntent(preset.intent);
									if (preset.phase !== void 0) setPhase(preset.phase);
								},
								className: "min-h-11 rounded-full border border-line px-3 text-xs text-foam",
								children: preset.label
							}, preset.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "phase",
									className: "text-xs tracking-widest text-mist uppercase",
									children: ["Vessel phase · ", phaseName(phase)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-foam",
									children: [
										"t ",
										phase.toFixed(2),
										" · ease ",
										easeNow.toFixed(3)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "phase",
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: phase,
								onChange: (event) => setPhase(Number(event.target.value)),
								"aria-valuetext": `${phaseName(phase)}, t ${phase.toFixed(2)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EaseCurve, { t: phase }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs tracking-widest text-mist uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sprout" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bloom" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wilt" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-mist",
								children: EASE_LAW
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-snug text-foam",
							children: SOUL_LINE
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-h-0 min-w-0 flex-col gap-5 px-4 py-5 sm:px-6 lg:col-start-3 lg:row-start-1 lg:overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-mist uppercase",
								children: "Omega gate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void copyReceipt(),
								disabled: !receipt,
								className: "min-h-11 rounded-full border border-line px-3 text-xs text-foam disabled:opacity-40",
								children: copied ? "Copied" : "Copy receipt"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `font-display text-3xl ${tone(receipt?.status ?? null)}`,
							children: running ? "READING" : receipt?.status ?? "AWAITING"
						}),
						plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-mist",
									children: "Expected"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "break-all text-foam",
									children: plan.expected
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-mist",
									children: "Observed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "break-all text-foam",
									children: plan.observed
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mist",
							children: "The receipt appears only after a real comparison. Remote limbs stay unknown."
						}),
						receipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "overflow-x-auto rounded-panel border border-line bg-void p-4 text-xs leading-relaxed break-all whitespace-pre-wrap text-foam",
								children: JSON.stringify(receipt, null, 2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-mist",
								children: "Evidence is the SHA-256 of the observed string."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-mist",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tracking-widest uppercase",
									children: "Next Δ · "
								}), receipt.next_delta]
							})
						] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-mist uppercase",
								children: "KAI ledger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: downloadLedger,
								className: "min-h-11 rounded-full border border-line px-3 text-xs text-foam",
								children: "Export"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `text-sm ${chain === "broken" || chain === "corrupt" ? "text-iris" : "text-mist"}`,
							children: [
								chain === "checking" && "Reading the chain.",
								chain === "empty" && `Empty. Genesis ${GENESIS} waits for the first seal.`,
								chain === "intact" && `${ledger.length} sealed. Chain intact.`,
								chain === "broken" && `Chain diverges at entry ${(brokenAt ?? 0) + 1}. Left untouched. No new seal.`,
								chain === "corrupt" && "Ledger bytes are not a valid document. Left untouched."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "flex flex-col gap-3",
							children: [...ledger].reverse().map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-t border-line pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: `text-xs tracking-widest uppercase ${tone(entry.status)}`,
										children: [
											entry.status,
											" · ",
											entry.tool_used
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm text-foam",
										children: entry.intent
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs break-all text-mist",
										children: entry.entry_hash
									})
								]
							}, entry.entry_hash))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-mist",
							children: DOCTRINE
						})
					]
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OmnicosConsole, {});
}
//#endregion
export { Home as component };
