/**
 * Generates the project presentation: docs/OrangeHRM-TEA-Presentation.pptx
 *
 * Reproduce:
 *   cd orangehrm-tea-demo
 *   npm install pptxgenjs --no-save
 *   node scripts/generate-presentation.mjs
 *
 * pptxgenjs is intentionally NOT a saved dependency (it is a docs tool, not part
 * of the test framework). Install it on demand with --no-save.
 */
import pptxgen from 'pptxgenjs';

const DARK = '0F172A'; // slate-900
const SLATE = '1E293B'; // slate-800
const GREEN = '2EAD33'; // Playwright green
const GREEN_D = '1F7A23';
const LIGHT = 'F8FAFC';
const GRAY = '64748B';
const TEXT = '0F172A';
const AMBER = 'D97706';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in
pptx.author = 'Test Engineering Architect';
pptx.company = 'BMad Method — TEA';
pptx.title = 'OrangeHRM Test Automation — TEA Framework Demo';

const W = 13.33;

// ---- Footer master ---------------------------------------------------------
pptx.defineSlideMaster({
  title: 'CONTENT',
  background: { color: 'FFFFFF' },
  objects: [
    { rect: { x: 0, y: 0, w: W, h: 0.9, fill: { color: DARK } } },
    { rect: { x: 0, y: 0.9, w: W, h: 0.06, fill: { color: GREEN } } },
    {
      text: {
        text: 'OrangeHRM TEA Demo  ·  Playwright + TypeScript',
        options: { x: 0.5, y: 7.0, w: 9, h: 0.35, fontSize: 9, color: GRAY, align: 'left' },
      },
    },
  ],
  slideNumber: { x: 12.5, y: 7.0, color: GRAY, fontSize: 9 },
});

const titleOpts = { x: 0.5, y: 0.12, w: 12.3, h: 0.7, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Segoe UI', valign: 'middle' };

function contentSlide(title) {
  const s = pptx.addSlide({ masterName: 'CONTENT' });
  s.addText(title, titleOpts);
  return s;
}

function bullets(items) {
  return items.map((t) => {
    if (typeof t === 'string') return { text: t, options: { bullet: { code: '2022' }, fontSize: 15, color: TEXT, paraSpaceAfter: 8 } };
    const { text, level = 0, bold = false, color = TEXT, size = 15 } = t;
    return { text, options: { bullet: { code: '2022', indent: 18 }, indentLevel: level, fontSize: size, bold, color, paraSpaceAfter: 6 } };
  });
}

// ---------------------------------------------------------------------------
// 1. TITLE
// ---------------------------------------------------------------------------
const t = pptx.addSlide();
t.background = { color: DARK };
t.addShape(pptx.ShapeType.rect, { x: 0, y: 4.55, w: W, h: 0.08, fill: { color: GREEN } });
t.addText('OrangeHRM Test Automation', { x: 0.7, y: 2.0, w: 12, h: 0.9, fontSize: 40, bold: true, color: 'FFFFFF', fontFace: 'Segoe UI' });
t.addText('A Production-Ready Demo Built on the BMad Method TEA Framework', { x: 0.7, y: 3.05, w: 12, h: 0.7, fontSize: 20, color: GREEN, fontFace: 'Segoe UI' });
t.addText(
  [
    { text: 'Playwright  ·  TypeScript  ·  MCP browser automation  ·  GitHub Actions CI', options: { fontSize: 14, color: 'CBD5E1' } },
  ],
  { x: 0.7, y: 4.8, w: 12, h: 0.5 },
);
t.addText('Presented by the Test Engineering Architect (TEA)', { x: 0.7, y: 6.2, w: 12, h: 0.4, fontSize: 13, italic: true, color: '94A3B8' });

// ---------------------------------------------------------------------------
// 2. AGENDA
// ---------------------------------------------------------------------------
let s = contentSlide('Agenda');
s.addText(
  bullets([
    'Why test architecture? The challenge & the TEA approach',
    'The 9 TEA core workflows and their artifacts',
    'Technical stack & framework architecture',
    'Risk-based test design (P0–P3)',
    'Coverage, traceability & the release gate',
    'CI/CD pipeline: shards, smoke & burn-in',
    'Real defects we caught — and what they taught us',
    'How to run it & roadmap',
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 3. THE CHALLENGE
// ---------------------------------------------------------------------------
s = contentSlide('The Challenge');
s.addText(
  bullets([
    { text: 'Test automation often grows ad-hoc: flaky tests, no priorities, no clear "ready to ship" signal.', bold: true },
    'Common pain points:',
    { text: 'Hard waits (sleep) → slow, brittle suites', level: 1 },
    { text: 'Fragile CSS/XPath selectors that break on every UI tweak', level: 1 },
    { text: 'No link between requirements, tests, and the go/no-go decision', level: 1 },
    { text: 'Quality is "felt", not measured', level: 1 },
    { text: 'TEA answers: treat testing as an architecture discipline — risk-driven, evidence-based, gated.', bold: true, color: GREEN_D },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 4. WHAT IS TEA
// ---------------------------------------------------------------------------
s = contentSlide('What is TEA?');
s.addText(
  bullets([
    { text: 'Test Engineering Architect — a BMad Method discipline.', bold: true },
    'Testing as an engineering architecture, not an afterthought.',
    'A repeatable set of workflows: teach → design → scaffold → CI → ATDD → automate → review → NFR audit → trace & gate.',
    'Every workflow emits a concrete, auditable artifact.',
    'Decisions are driven by risk and backed by evidence.',
  ]),
  { x: 0.7, y: 1.3, w: 7.4, h: 5.4 },
);
s.addShape(pptx.ShapeType.roundRect, { x: 8.5, y: 1.5, w: 4.2, h: 4.6, fill: { color: LIGHT }, line: { color: GREEN, width: 1.5 }, rectRadius: 0.1 });
s.addText('This project', { x: 8.7, y: 1.7, w: 3.8, h: 0.4, fontSize: 14, bold: true, color: GREEN_D });
s.addText(
  bullets([
    { text: 'SUT: OrangeHRM demo site', size: 13 },
    { text: '17 tests (14 active, 3 ATDD)', size: 13 },
    { text: '5 spec files, 3 page objects', size: 13 },
    { text: '9 docs artifacts', size: 13 },
    { text: 'Green CI on GitHub Actions', size: 13 },
  ]),
  { x: 8.7, y: 2.2, w: 3.8, h: 3.7 },
);

// ---------------------------------------------------------------------------
// 5. TECH STACK
// ---------------------------------------------------------------------------
s = contentSlide('Technical Stack');
const stack = [
  ['Layer', 'Choice', 'Why'],
  ['Test runner', 'Playwright', 'Auto-waiting, tracing, parallelism, sharding'],
  ['Language', 'TypeScript (strict)', 'Type safety, maintainable page objects'],
  ['Browser automation', 'MCP mode', 'AI agent authors/maintains tests on a live session'],
  ['Pattern', 'Page Object Model', 'Selectors centralized, specs stay declarative'],
  ['CI/CD', 'GitHub Actions', '2 shards + smoke + nightly + burn-in'],
  ['Reporting', 'HTML + list + traces', 'Human-readable + debuggable failures'],
];
s.addTable(stack, {
  x: 0.6, y: 1.25, w: 12.1, colW: [2.5, 2.8, 6.8],
  fontSize: 13, color: TEXT, valign: 'middle',
  border: { type: 'solid', color: 'E2E8F0', pt: 1 },
  fill: { color: 'FFFFFF' },
  rowH: 0.5,
});
// header styling done via first-row override
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.25, w: 12.1, h: 0.5, fill: { type: 'none' } });

// ---------------------------------------------------------------------------
// 6. ARCHITECTURE
// ---------------------------------------------------------------------------
s = contentSlide('Framework Architecture');
s.addText(
  bullets([
    { text: 'Page Object Model', bold: true, color: GREEN_D },
    { text: 'LoginPage · DashboardPage · AdminPage — all UI access flows through them', level: 1 },
    { text: 'Role-based selectors only', bold: true, color: GREEN_D },
    { text: 'getByRole / getByLabel / getByPlaceholder — no CSS, no XPath', level: 1 },
    { text: 'Isolated-context auth fixture', bold: true, color: GREEN_D },
    { text: 'authenticatedPage logs in per test in its own context — resilient to demo session expiry', level: 1 },
    { text: 'Network-first synchronization', bold: true, color: GREEN_D },
    { text: 'waitForURL, waitForResponse, web-first expect() — zero hard waits', level: 1 },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 7. RISK-BASED DESIGN
// ---------------------------------------------------------------------------
s = contentSlide('Risk-Based Test Design (P0–P3)');
s.addText('Priority = probability × impact. Coverage targets per band.', { x: 0.6, y: 1.0, w: 12, h: 0.35, fontSize: 13, italic: true, color: GRAY });
const risk = [
  ['Band', 'Meaning', 'Target', 'Examples'],
  ['P0', 'Critical — entry point, security, core state', '100%', 'Valid/invalid login, empty fields, dashboard, logout'],
  ['P1', 'High — common failures, recovery, discoverability', '≥ 90%', 'Wrong password, forgot-pw, nav items, admin search'],
  ['P2', 'Medium — NFRs & secondary behaviour', '≥ 50%', 'Page load < 3s, no-records, reset filter'],
  ['P3', 'Low — cosmetic / rare', '≥ 20%', '(none in scope)'],
];
s.addTable(risk, {
  x: 0.6, y: 1.5, w: 12.1, colW: [1.1, 4.6, 1.2, 5.2],
  fontSize: 12.5, color: TEXT, valign: 'middle',
  border: { type: 'solid', color: 'E2E8F0', pt: 1 }, rowH: 0.7,
});

// ---------------------------------------------------------------------------
// 8. THE 9 WORKFLOWS
// ---------------------------------------------------------------------------
s = contentSlide('The 9 TEA Workflows → Artifacts');
const wf = [
  ['#', 'Workflow', 'Output artifact'],
  ['1', 'Teach Me Testing', 'docs/tea-academy-summary.md'],
  ['2', 'Framework Setup', 'Config, POMs, auth fixture, scaffold'],
  ['3', 'Test Design', 'docs/test-design-qa.md (P0–P3)'],
  ['4', 'CI/CD Integration', '.github/workflows/test.yml'],
  ['5', 'ATDD', 'login-atdd.spec.ts + checklist'],
  ['6', 'Automate', 'login / logout / dashboard / admin specs'],
  ['7', 'Test Review', 'docs/test-review-report.md (92.7/100)'],
  ['8', 'NFR Evidence Audit', 'docs/nfr-assessment.md'],
  ['9', 'Requirements Tracing', 'traceability-matrix.md + gate-decision.md'],
];
s.addTable(wf, {
  x: 0.9, y: 1.2, w: 11.5, colW: [0.7, 3.6, 7.2],
  fontSize: 12.5, color: TEXT, valign: 'middle',
  border: { type: 'solid', color: 'E2E8F0', pt: 1 }, rowH: 0.46,
});

// ---------------------------------------------------------------------------
// 9. COVERAGE & TRACEABILITY
// ---------------------------------------------------------------------------
s = contentSlide('Coverage & Traceability');
s.addText(
  bullets([
    'Every scenario carries a REQ ID: Design → Test → Trace matrix → Gate.',
    '16 requirements mapped to test files & line numbers.',
  ]),
  { x: 0.7, y: 1.2, w: 12, h: 1.1 },
);
const cov = [
  ['Priority', 'Required', 'Covered', 'Coverage', 'Target met?'],
  ['P0', '6', '6', '100%', 'Yes'],
  ['P1', '7', '6 active (7 authored)', '85.7%', 'CONCERNS band'],
  ['P2', '3', '2 full + 1 NFR', '100%', 'Yes'],
  ['P3', '0', '—', 'n/a', 'Yes'],
];
s.addTable(cov, {
  x: 0.9, y: 2.5, w: 11.5, colW: [1.8, 1.8, 3.5, 2.2, 2.2],
  fontSize: 13, color: TEXT, valign: 'middle', align: 'center',
  border: { type: 'solid', color: 'E2E8F0', pt: 1 }, rowH: 0.6,
});
s.addText('REQ-11 (session-not-persisted) is authored but deferred to ATDD → keeps gate honest at CONCERNS.', { x: 0.9, y: 6.3, w: 11.5, h: 0.4, fontSize: 12, italic: true, color: AMBER });

// ---------------------------------------------------------------------------
// 10. CI/CD
// ---------------------------------------------------------------------------
s = contentSlide('CI/CD Pipeline (GitHub Actions)');
s.addText(
  bullets([
    { text: 'Triggers: push to main · pull request · nightly 02:00 UTC', bold: true },
    'test — full suite across 2 parallel shards (matrix)',
    'smoke — only @smoke tests on every push (fast signal)',
    'burn-in — runs the suite 3× on PRs to detect flakiness',
    'npm + Playwright browser caching; HTML report & traces as artifacts (7-day retention)',
    { text: 'Headless chromium only on CI — the headed Chrome project is local-only (no display on runners).', color: GREEN_D },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 11. QUALITY STANDARDS
// ---------------------------------------------------------------------------
s = contentSlide('Enforced Quality Standards');
s.addText(
  bullets([
    { text: 'No waitForTimeout / hard waits — network-first only', color: GREEN_D },
    { text: 'No CSS / XPath — role / label / placeholder selectors only', color: GREEN_D },
    { text: 'No if/else flow control in test bodies', color: GREEN_D },
    { text: 'Page Object Model for all UI interaction', color: GREEN_D },
    { text: 'Parallel-safe, self-contained tests that clean up after themselves', color: GREEN_D },
    { text: 'Explicit assertions with clear failure messages', color: GREEN_D },
    { text: 'Every test file < 300 lines', color: GREEN_D },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 12. RESULTS / GATE
// ---------------------------------------------------------------------------
s = contentSlide('Results & Release Gate');
s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 1.3, w: 3.7, h: 1.5, fill: { color: 'ECFDF5' }, line: { color: GREEN, width: 1 }, rectRadius: 0.08 });
s.addText([{ text: '14', options: { fontSize: 36, bold: true, color: GREEN_D } }, { text: '  passed', options: { fontSize: 16, color: TEXT } }], { x: 0.7, y: 1.45, w: 3.7, h: 0.7, align: 'center' });
s.addText('3 skipped (ATDD) · 0 failed', { x: 0.7, y: 2.25, w: 3.7, h: 0.4, fontSize: 12, align: 'center', color: GRAY });

s.addShape(pptx.ShapeType.roundRect, { x: 4.7, y: 1.3, w: 3.7, h: 1.5, fill: { color: 'EFF6FF' }, line: { color: '2563EB', width: 1 }, rectRadius: 0.08 });
s.addText([{ text: '92.7', options: { fontSize: 36, bold: true, color: '1D4ED8' } }, { text: ' / 100', options: { fontSize: 16, color: TEXT } }], { x: 4.7, y: 1.45, w: 3.7, h: 0.7, align: 'center' });
s.addText('Test Review score → PASS', { x: 4.7, y: 2.25, w: 3.7, h: 0.4, fontSize: 12, align: 'center', color: GRAY });

s.addShape(pptx.ShapeType.roundRect, { x: 8.7, y: 1.3, w: 3.9, h: 1.5, fill: { color: 'FFFBEB' }, line: { color: AMBER, width: 1 }, rectRadius: 0.08 });
s.addText([{ text: 'CONCERNS', options: { fontSize: 26, bold: true, color: AMBER } }], { x: 8.7, y: 1.5, w: 3.9, h: 0.7, align: 'center' });
s.addText('Gate: P0 100%, P1 85.7%', { x: 8.7, y: 2.25, w: 3.9, h: 0.4, fontSize: 12, align: 'center', color: GRAY });

s.addText(
  bullets([
    'TEA gate rules: PASS if P0=100% & P1≥90% & Overall≥80%; CONCERNS if P1 80–89%.',
    'Performance, Reliability & Maintainability NFRs: PASS. Security: CONCERNS (deep session checks deferred).',
    { text: 'Path to PASS: activate the 3 ATDD scaffolds → P1 reaches 100%.', bold: true, color: GREEN_D },
  ]),
  { x: 0.7, y: 3.2, w: 12, h: 3 },
);

// ---------------------------------------------------------------------------
// 13. CHALLENGES / LESSONS
// ---------------------------------------------------------------------------
s = contentSlide('Real Defects We Caught');
s.addText(
  bullets([
    { text: '1. Wrong textbox in Admin search', bold: true, color: AMBER },
    { text: 'The sidebar menu "Search" was the first textbox — searches never filtered. Fixed by targeting the correct field; verified against the live DOM.', level: 1 },
    { text: '2. Race condition in the reset test', bold: true, color: AMBER },
    { text: 'Read the record count before the grid re-rendered (exposed by slowMo). Fixed with web-first settled-state assertions.', level: 1 },
    { text: '3. Headed Chrome broke CI', bold: true, color: AMBER },
    { text: 'A headed browser can’t launch on a CI runner (no display). Fixed by making the Chrome project local-only.', level: 1 },
    { text: 'Lesson: run at multiple speeds, inspect real state, and treat CI as a distinct environment.', bold: true, color: GREEN_D },
  ]),
  { x: 0.7, y: 1.2, w: 12, h: 5.6 },
);

// ---------------------------------------------------------------------------
// 14. HOW TO RUN
// ---------------------------------------------------------------------------
s = contentSlide('How to Run');
s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 1.3, w: 12, h: 3.5, fill: { color: SLATE }, rectRadius: 0.08 });
s.addText(
  [
    { text: '# setup\n', options: { color: '94A3B8', fontSize: 14 } },
    { text: 'npm install\nnpx playwright install chromium\n\n', options: { color: 'E2E8F0', fontSize: 14 } },
    { text: '# run\n', options: { color: '94A3B8', fontSize: 14 } },
    { text: 'npm test            ', options: { color: GREEN, fontSize: 14 } },
    { text: '# full suite (headless)\n', options: { color: '94A3B8', fontSize: 14 } },
    { text: 'npm run test:smoke  ', options: { color: GREEN, fontSize: 14 } },
    { text: '# @smoke tests\n', options: { color: '94A3B8', fontSize: 14 } },
    { text: 'npm run test:chrome ', options: { color: GREEN, fontSize: 14 } },
    { text: '# real Chrome, watchable\n', options: { color: '94A3B8', fontSize: 14 } },
    { text: 'npm run test:report ', options: { color: GREEN, fontSize: 14 } },
    { text: '# open HTML report', options: { color: '94A3B8', fontSize: 14 } },
  ],
  { x: 1.0, y: 1.55, w: 11.4, h: 3, fontFace: 'Consolas', align: 'left', valign: 'top', lineSpacingMultiple: 1.1 },
);
s.addText('Public demo credentials (Admin / admin123) work out of the box; override via .env or CI secrets.', { x: 0.7, y: 5.1, w: 12, h: 0.4, fontSize: 13, italic: true, color: GRAY });

// ---------------------------------------------------------------------------
// 15. ROADMAP
// ---------------------------------------------------------------------------
s = contentSlide('Roadmap');
s.addText(
  bullets([
    'Activate the 3 ATDD scaffolds (session cookie, redirect guard, reset page) → lift gate to PASS.',
    'Expand HR coverage: PIM, Leave, Time modules.',
    'Cross-browser matrix (Firefox, WebKit) behind a CI flag.',
    'Add a dedicated performance assertion for the < 3s page-load NFR.',
    'Visual regression snapshots for key pages.',
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---------------------------------------------------------------------------
// 16. THANK YOU
// ---------------------------------------------------------------------------
const ty = pptx.addSlide();
ty.background = { color: DARK };
ty.addShape(pptx.ShapeType.rect, { x: 0, y: 3.5, w: W, h: 0.08, fill: { color: GREEN } });
ty.addText('Thank You', { x: 0.7, y: 2.3, w: 12, h: 1, fontSize: 44, bold: true, color: 'FFFFFF' });
ty.addText('Questions & discussion', { x: 0.7, y: 3.7, w: 12, h: 0.6, fontSize: 20, color: GREEN });
ty.addText('Repo: github.com/AlexAI22/BMadTestArhitect', { x: 0.7, y: 4.6, w: 12, h: 0.5, fontSize: 14, color: 'CBD5E1' });

const OUT = 'docs/OrangeHRM-TEA-Presentation.pptx';
await pptx.writeFile({ fileName: OUT });
console.log('Wrote ' + OUT);
