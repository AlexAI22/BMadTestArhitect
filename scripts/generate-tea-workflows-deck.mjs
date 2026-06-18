/**
 * Generates: docs/TEA-Workflows-Deep-Dive.pptx
 * A deep dive into all 9 TEA workflows + advantages/disadvantages of the
 * TEA implementation, grounded in this OrangeHRM project.
 *
 * Reproduce:
 *   cd orangehrm-tea-demo
 *   npm install pptxgenjs --no-save
 *   node scripts/generate-tea-workflows-deck.mjs
 */
import pptxgen from 'pptxgenjs';

const DARK = '0F172A';
const SLATE = '1E293B';
const GREEN = '2EAD33';
const GREEN_D = '1F7A23';
const LIGHT = 'F8FAFC';
const GRAY = '64748B';
const TEXT = '0F172A';
const AMBER = 'D97706';
const RED = 'DC2626';
const BLUE = '2563EB';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Test Engineering Architect';
pptx.company = 'BMad Method — TEA';
pptx.title = 'The 9 TEA Workflows — Deep Dive';
const W = 13.33;

pptx.defineSlideMaster({
  title: 'CONTENT',
  background: { color: 'FFFFFF' },
  objects: [
    { rect: { x: 0, y: 0, w: W, h: 0.9, fill: { color: DARK } } },
    { rect: { x: 0, y: 0.9, w: W, h: 0.06, fill: { color: GREEN } } },
    { text: { text: 'TEA Workflows Deep Dive  ·  OrangeHRM Demo', options: { x: 0.5, y: 7.0, w: 9, h: 0.35, fontSize: 9, color: GRAY } } },
  ],
  slideNumber: { x: 12.5, y: 7.0, color: GRAY, fontSize: 9 },
});

const titleOpts = { x: 0.5, y: 0.12, w: 12.3, h: 0.7, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Segoe UI', valign: 'middle' };

function contentSlide(title) {
  const s = pptx.addSlide({ masterName: 'CONTENT' });
  s.addText(title, titleOpts);
  return s;
}
function bullets(items, opts = {}) {
  return items.map((t) => {
    if (typeof t === 'string') return { text: t, options: { bullet: { code: '2022' }, fontSize: opts.size || 15, color: TEXT, paraSpaceAfter: 7 } };
    const { text, level = 0, bold = false, color = TEXT, size = opts.size || 15 } = t;
    return { text, options: { bullet: { code: '2022', indent: 16 }, indentLevel: level, fontSize: size, bold, color, paraSpaceAfter: 6 } };
  });
}

// ---- Title ----
const t = pptx.addSlide();
t.background = { color: DARK };
t.addShape(pptx.ShapeType.rect, { x: 0, y: 4.55, w: W, h: 0.08, fill: { color: GREEN } });
t.addText('The 9 TEA Core Workflows', { x: 0.7, y: 1.9, w: 12, h: 1, fontSize: 40, bold: true, color: 'FFFFFF' });
t.addText('A Workflow-by-Workflow Deep Dive + Advantages & Disadvantages', { x: 0.7, y: 3.0, w: 12, h: 0.7, fontSize: 20, color: GREEN });
t.addText('Grounded in the OrangeHRM Playwright + TypeScript demo', { x: 0.7, y: 4.8, w: 12, h: 0.5, fontSize: 14, color: 'CBD5E1' });
t.addText('Test Engineering Architect (TEA) · BMad Method', { x: 0.7, y: 6.2, w: 12, h: 0.4, fontSize: 13, italic: true, color: '94A3B8' });

// ---- Overview ----
let s = contentSlide('What is TEA — and the 9 Workflows');
s.addText(
  bullets([
    { text: 'TEA = Test Engineering Architect: testing as an architecture discipline.', bold: true },
    'Run as an ordered pipeline; each workflow produces one auditable artifact.',
  ]),
  { x: 0.7, y: 1.2, w: 12, h: 1.2 },
);
const ov = [
  ['Teach Me Testing (TMT)', 'Test Design (TD)', 'ATDD (AT)'],
  ['Framework Setup (TF)', 'CI/CD Integration (CI)', 'Automate (TA)'],
  ['Test Review (RV)', 'NFR Evidence Audit (NR)', 'Requirements Tracing (TR)'],
];
let yy = 2.6;
ov.forEach((row) => {
  row.forEach((cell, ci) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.7 + ci * 4.1, y: yy, w: 3.9, h: 1.0, fill: { color: LIGHT }, line: { color: GREEN, width: 1 }, rectRadius: 0.06 });
    s.addText(cell, { x: 0.7 + ci * 4.1, y: yy, w: 3.9, h: 1.0, align: 'center', valign: 'middle', fontSize: 14, bold: true, color: SLATE });
  });
  yy += 1.2;
});

// ---- Workflow slide helper ----
function workflowSlide(num, code, name, what, project, artifact, color = GREEN_D) {
  const sl = pptx.addSlide({ masterName: 'CONTENT' });
  sl.addText(`Workflow ${num} — ${name} (${code})`, titleOpts);
  // number badge
  sl.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.25, w: 1.5, h: 1.5, fill: { color: color }, rectRadius: 0.1 });
  sl.addText(String(num), { x: 0.6, y: 1.25, w: 1.5, h: 1.5, align: 'center', valign: 'middle', fontSize: 54, bold: true, color: 'FFFFFF' });

  sl.addText('What it is', { x: 2.4, y: 1.25, w: 10.3, h: 0.35, fontSize: 14, bold: true, color: color });
  sl.addText(what, { x: 2.4, y: 1.6, w: 10.3, h: 1.1, fontSize: 14, color: TEXT, valign: 'top' });

  sl.addText('In this project', { x: 0.6, y: 3.1, w: 12.1, h: 0.35, fontSize: 14, bold: true, color: color });
  sl.addText(bullets(project, { size: 13.5 }), { x: 0.8, y: 3.45, w: 11.9, h: 2.6, valign: 'top' });

  sl.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 6.15, w: 12.1, h: 0.7, fill: { color: LIGHT }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.06 });
  sl.addText([{ text: 'Artifact:  ', options: { bold: true, color: color } }, { text: artifact, options: { color: TEXT, fontFace: 'Consolas' } }], { x: 0.8, y: 6.15, w: 11.7, h: 0.7, valign: 'middle', fontSize: 13 });
  return sl;
}

workflowSlide(1, 'TMT', 'Teach Me Testing',
  'A condensed onboarding primer — the 7 TEA Academy sessions distilled and adapted to this project so anyone cloning the repo ramps up fast.',
  [
    'Covers: what TEA is, risk-based testing, fixtures & network-first, test design, ATDD + Automate, review + trace, and 5 advanced patterns',
    'Acts as the "read me first" for new contributors',
    'Links every concept to the concrete file that implements it',
  ],
  'docs/tea-academy-summary.md');

workflowSlide(2, 'TF', 'Framework Setup',
  'Scaffolds a production-ready Playwright + TypeScript framework with the conventions every later workflow depends on.',
  [
    'playwright.config.ts: baseURL, chromium headless, retries (2 on CI), traces/screenshots on failure, HTML + list reporters, MCP note',
    'Page Object Model: LoginPage · DashboardPage · AdminPage',
    'authenticatedPage fixture, TypeScript strict, .env.example, .nvmrc (Node 20), README',
  ],
  'playwright.config.ts · tests/support/page-objects · tests/fixtures');

workflowSlide(3, 'TD', 'Test Design',
  'Turns prioritized risk (probability × impact → P0–P3) into concrete, traceable scenarios with explicit acceptance criteria and NFR thresholds — before code.',
  [
    '16 scenarios (REQ-01…REQ-16) scored and justified across login, dashboard, admin',
    'NFR thresholds: login page load < 3s, login response < 2s',
    'Sprint-0 setup checklist + known risks (demo flakiness, shared credentials)',
  ],
  'docs/test-design-qa.md');

workflowSlide(4, 'CI', 'CI/CD Integration',
  'Wires the suite into GitHub Actions so quality signals run automatically and continuously.',
  [
    'Triggers: push to main · pull request · nightly 02:00 UTC',
    'Jobs: test (2 shards) · smoke (@smoke on push) · burn-in (3× on PRs for flakiness)',
    'npm + Playwright browser caching; HTML report & traces uploaded as artifacts (7-day retention)',
  ],
  '.github/workflows/test.yml');

workflowSlide(5, 'AT', 'ATDD',
  'Acceptance Test-Driven Development: write the acceptance test FIRST, in a failing/red state, so the criterion is unambiguous before implementation.',
  [
    '3 red-phase scaffolds (test.skip) with FULL assertion logic — not placeholders',
    'Covers: forgot-password reset page, session cookie cleared, protected-route redirect',
    'Tracked with owner & effort in an activation checklist',
  ],
  'tests/e2e/auth/login-atdd.spec.ts · docs/atdd-implementation-checklist.md',
  AMBER);

workflowSlide(6, 'TA', 'Automate',
  'Delivers green, durable tests for behaviour that already exists — the bulk of working coverage.',
  [
    'login · logout · dashboard · admin specs covering all P0/P1 scenarios',
    'Page Object Model, role/label/placeholder selectors, network-first waits',
    '14 tests passing; parallel-safe and self-contained',
  ],
  'tests/e2e/**/*.spec.ts');

workflowSlide(7, 'RV', 'Test Review',
  'An objective, scored quality audit of every test against TEA standards — a gate input, not a vibe check.',
  [
    'Dimensions: Determinism 30% · Isolation 30% · Maintainability 25% · Performance 15%',
    'Per-file findings with severity and recommendations',
    'Weighted overall: 92.7 / 100 → PASS (gate threshold ≥ 80)',
  ],
  'docs/test-review-report.md',
  BLUE);

workflowSlide(8, 'NR', 'NFR Evidence Audit',
  'Assesses non-functional requirements against thresholds, backed by evidence (trace timings, burn-in, code review).',
  [
    'Performance: page load < 3s, login < 2s → PASS',
    'Reliability (burn-in) & Maintainability (POM, <300 lines) → PASS',
    'Security (limited demo): empty-field & generic-error checks → CONCERNS (deep session checks deferred)',
  ],
  'docs/nfr-assessment.md',
  BLUE);

workflowSlide(9, 'TR', 'Requirements Tracing',
  'Maps every scenario to its test, then renders a go/no-go release gate from explicit rules — the auditable "are we safe to ship?" answer.',
  [
    'Phase 1: traceability matrix (REQ → file:line, coverage %)',
    'Phase 2: gate decision — P0 100%, P1 85.7% → CONCERNS (PASS once REQ-11 activates)',
    'Coverage: P0 100%, P2 100%; accepted risks & approvals recorded',
  ],
  'docs/traceability-matrix.md · docs/gate-decision.md',
  BLUE);

// ---- Advantages ----
s = contentSlide('Advantages of the TEA Implementation');
s.addText(
  bullets([
    { text: 'Risk-driven focus', bold: true, color: GREEN_D },
    { text: 'P0–P3 prioritization spends effort where failure hurts most; P0 must be 100%.', level: 1 },
    { text: 'Full traceability & auditability', bold: true, color: GREEN_D },
    { text: 'REQ → test → matrix → gate; every claim is backed by an artifact.', level: 1 },
    { text: 'Evidence-based release gate', bold: true, color: GREEN_D },
    { text: 'Go/no-go is objective and repeatable, not a judgement call.', level: 1 },
    { text: 'Low flake, high maintainability', bold: true, color: GREEN_D },
    { text: 'No hard waits, role selectors, POM, network-first → resilient & fast (14 green, ~40s on CI).', level: 1 },
    { text: 'Scales & onboards', bold: true, color: GREEN_D },
    { text: 'Structure holds as the suite grows; the teach-me doc ramps newcomers. MCP enables AI-assisted authoring.', level: 1 },
  ], { size: 14 }),
  { x: 0.7, y: 1.2, w: 12, h: 5.6 },
);

// ---- Disadvantages ----
s = contentSlide('Disadvantages & Trade-offs');
s.addText(
  bullets([
    { text: 'Documentation overhead', bold: true, color: RED },
    { text: '9 artifacts to write and keep in sync; docs can drift from code (we had to update them when the fixture changed).', level: 1 },
    { text: 'Process ceremony', bold: true, color: RED },
    { text: 'Can feel heavy for tiny projects/teams; needs TEA discipline and a learning curve.', level: 1 },
    { text: 'Subjective risk scoring', bold: true, color: RED },
    { text: 'Probability × impact estimates vary by author; priorities are only as good as the inputs.', level: 1 },
    { text: 'ATDD scaffolds can rot', bold: true, color: RED },
    { text: 'Deferred red-phase tests (e.g. REQ-11) linger if not activated — and dropped our gate to CONCERNS.', level: 1 },
    { text: 'Does not fix the environment', bold: true, color: RED },
    { text: 'External SUT flakiness, shared creds, per-test login cost, CI nuances (headed Chrome) still require engineering.', level: 1 },
  ], { size: 14 }),
  { x: 0.7, y: 1.2, w: 12, h: 5.6 },
);

// ---- Balanced verdict ----
s = contentSlide('Verdict — When TEA Pays Off');
s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 1.3, w: 5.9, h: 4.4, fill: { color: 'ECFDF5' }, line: { color: GREEN, width: 1.2 }, rectRadius: 0.08 });
s.addText('Use TEA when…', { x: 0.9, y: 1.5, w: 5.5, h: 0.4, fontSize: 16, bold: true, color: GREEN_D });
s.addText(
  bullets([
    'Quality is business-critical or regulated',
    'Multiple teams / long-lived product',
    'You need an auditable ship decision',
    'Coverage must be defensible, not anecdotal',
    'The suite will grow over time',
  ], { size: 13.5 }),
  { x: 1.0, y: 2.0, w: 5.4, h: 3.5 },
);
s.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 1.3, w: 5.7, h: 4.4, fill: { color: 'FEF2F2' }, line: { color: RED, width: 1.2 }, rectRadius: 0.08 });
s.addText('Lighten it when…', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 16, bold: true, color: RED });
s.addText(
  bullets([
    'Short-lived spike or throwaway prototype',
    'Solo dev, very small surface area',
    'No release-gate stakeholders to satisfy',
    'Then: keep risk design + standards, trim heavy docs',
  ], { size: 13.5 }),
  { x: 7.2, y: 2.0, w: 5.2, h: 3.5 },
);
s.addText('Mitigation: automate artifact generation, review docs in the same PR as code, and schedule ATDD activation so scaffolds don’t rot.', { x: 0.7, y: 6.0, w: 12, h: 0.7, fontSize: 13, italic: true, color: SLATE });

// ---- Thank you ----
const ty = pptx.addSlide();
ty.background = { color: DARK };
ty.addShape(pptx.ShapeType.rect, { x: 0, y: 3.5, w: W, h: 0.08, fill: { color: GREEN } });
ty.addText('Thank You', { x: 0.7, y: 2.3, w: 12, h: 1, fontSize: 44, bold: true, color: 'FFFFFF' });
ty.addText('9 workflows · 1 honest gate · measurable quality', { x: 0.7, y: 3.7, w: 12, h: 0.6, fontSize: 18, color: GREEN });
ty.addText('Repo: github.com/AlexAI22/BMadTestArhitect', { x: 0.7, y: 4.6, w: 12, h: 0.5, fontSize: 14, color: 'CBD5E1' });

const OUT = 'docs/TEA-Workflows-Deep-Dive.pptx';
await pptx.writeFile({ fileName: OUT });
console.log('Wrote ' + OUT);
