/**
 * Generates: docs/OrangeHRM-QA-Team-Presentation.pptx
 * A hands-on walkthrough for presenting the project to a QA team:
 * what it is, how to run/debug it, how to write tests, the standards, and a
 * live-demo plan.
 *
 * Reproduce:
 *   cd orangehrm-tea-demo
 *   npm install pptxgenjs --no-save
 *   node scripts/generate-qa-team-deck.mjs
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
pptx.company = 'QA Team';
pptx.title = 'OrangeHRM Test Automation — QA Team Walkthrough';
const W = 13.33;

pptx.defineSlideMaster({
  title: 'CONTENT',
  background: { color: 'FFFFFF' },
  objects: [
    { rect: { x: 0, y: 0, w: W, h: 0.9, fill: { color: DARK } } },
    { rect: { x: 0, y: 0.9, w: W, h: 0.06, fill: { color: GREEN } } },
    { text: { text: 'OrangeHRM Automation  ·  QA Team Walkthrough', options: { x: 0.5, y: 7.0, w: 9, h: 0.35, fontSize: 9, color: GRAY } } },
  ],
  slideNumber: { x: 12.5, y: 7.0, color: GRAY, fontSize: 9 },
});

const titleOpts = { x: 0.5, y: 0.12, w: 12.3, h: 0.7, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Segoe UI', valign: 'middle' };
function slide(title) {
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
function codeBox(s, x, y, w, h, parts) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: SLATE }, rectRadius: 0.06 });
  s.addText(parts, { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: h - 0.36, fontFace: 'Consolas', fontSize: 12.5, align: 'left', valign: 'top', lineSpacingMultiple: 1.12 });
}
const c = {
  k: (t) => ({ text: t, options: { color: '93C5FD' } }), // keyword/blue
  s: (t) => ({ text: t, options: { color: 'FCD34D' } }), // string/yellow
  g: (t) => ({ text: t, options: { color: '86EFAC' } }), // green ident
  d: (t) => ({ text: t, options: { color: 'CBD5E1' } }), // default
  m: (t) => ({ text: t, options: { color: '94A3B8' } }), // comment/muted
};

// ---- Title ----
const t = pptx.addSlide();
t.background = { color: DARK };
t.addShape(pptx.ShapeType.rect, { x: 0, y: 4.55, w: W, h: 0.08, fill: { color: GREEN } });
t.addText('OrangeHRM Test Automation', { x: 0.7, y: 1.9, w: 12, h: 1, fontSize: 40, bold: true, color: 'FFFFFF' });
t.addText('A QA Team Walkthrough — how it works & how to use it', { x: 0.7, y: 3.0, w: 12, h: 0.7, fontSize: 20, color: GREEN });
t.addText('Playwright · TypeScript · Page Object Model · GitHub Actions CI', { x: 0.7, y: 4.8, w: 12, h: 0.5, fontSize: 14, color: 'CBD5E1' });
t.addText('Presented by the Test Engineering Architect', { x: 0.7, y: 6.2, w: 12, h: 0.4, fontSize: 13, italic: true, color: '94A3B8' });

// ---- Why this matters to QA ----
let s = slide('Why This Matters to Us (QA)');
s.addText(
  bullets([
    { text: 'Repeatable, fast regression — no more manual click-through of login/admin flows.', bold: true },
    'Stable, low-flake tests: zero hard waits, auto-waiting on real app state.',
    'Clear priorities: P0/P1 tags tell us what must pass before we ship.',
    'A single, objective "ready to ship?" signal — the release gate.',
    'Easy to extend: add a scenario in minutes using the page objects.',
    'Runs in CI on every push/PR — failures caught before merge, not in prod.',
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- Repo at a glance ----
s = slide('The Repo at a Glance');
const stat = [
  ['17', 'tests (14 active, 3 ATDD)'],
  ['5', 'spec files'],
  ['3', 'page objects'],
  ['4', 'features covered (login, logout, dashboard, admin)'],
];
stat.forEach((row, i) => {
  const x = 0.7 + (i % 2) * 6.1;
  const y = 1.4 + Math.floor(i / 2) * 1.6;
  s.addShape(pptx.ShapeType.roundRect, { x, y, w: 5.8, h: 1.35, fill: { color: LIGHT }, line: { color: GREEN, width: 1 }, rectRadius: 0.08 });
  s.addText([{ text: row[0] + '   ', options: { fontSize: 34, bold: true, color: GREEN_D } }, { text: row[1], options: { fontSize: 15, color: TEXT } }], { x: x + 0.2, y, w: 5.5, h: 1.35, valign: 'middle' });
});
s.addText('All green in CI on GitHub Actions (2 shards + smoke; burn-in on PRs).', { x: 0.7, y: 4.8, w: 12, h: 0.4, fontSize: 13, italic: true, color: GRAY });

// ---- Project structure ----
s = slide('Project Structure');
codeBox(s, 0.7, 1.3, 12, 5.2, [
  c.d('tests/\n'),
  c.d('  e2e/\n'),
  c.d('    auth/        '), c.m('login.spec.ts · login-atdd.spec.ts · logout.spec.ts\n'),
  c.d('    dashboard/   '), c.m('dashboard.spec.ts\n'),
  c.d('    admin/       '), c.m('admin.spec.ts  (System Users)\n'),
  c.d('  fixtures/      '), c.m('auth.fixture.ts  (authenticatedPage)\n'),
  c.d('  support/page-objects/  '), c.m('LoginPage · DashboardPage · AdminPage\n\n'),
  c.d('docs/            '), c.m('9 TEA artifacts (design, review, NFR, gate, ...)\n'),
  c.d('.github/workflows/test.yml   '), c.m('CI pipeline\n'),
  c.d('playwright.config.ts         '), c.m('baseURL, projects, traces\n'),
]);

// ---- Architecture ----
s = slide('How It Is Built');
s.addText(
  bullets([
    { text: 'Page Object Model', bold: true, color: GREEN_D },
    { text: 'Each page (Login, Dashboard, Admin) wraps its locators + actions. Specs read like English.', level: 1 },
    { text: 'authenticatedPage fixture', bold: true, color: GREEN_D },
    { text: 'Logs in for you in an isolated context — your test starts on the dashboard.', level: 1 },
    { text: 'Role-based selectors only', bold: true, color: GREEN_D },
    { text: 'getByRole / getByLabel / getByPlaceholder — survive CSS/markup changes.', level: 1 },
    { text: 'Network-first waits', bold: true, color: GREEN_D },
    { text: 'waitForURL / waitForResponse / expect().toBeVisible() — never sleep().', level: 1 },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- Quality standards do/don't ----
s = slide('Our Quality Standards (Non-Negotiable)');
s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 1.3, w: 5.9, h: 4.7, fill: { color: 'ECFDF5' }, line: { color: GREEN, width: 1.2 }, rectRadius: 0.08 });
s.addText('DO', { x: 0.9, y: 1.45, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: GREEN_D });
s.addText(bullets([
  'Use the page objects for all UI actions',
  'Use getByRole / getByLabel / getByPlaceholder',
  'Wait on URL / response / visibility',
  'Tag critical paths @smoke; note // P0 // P1',
  'Keep tests self-contained & under 300 lines',
  'Write clear assertion messages',
], { size: 13.5 }), { x: 1.0, y: 1.9, w: 5.4, h: 4 });

s.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 1.3, w: 5.7, h: 4.7, fill: { color: 'FEF2F2' }, line: { color: RED, width: 1.2 }, rectRadius: 0.08 });
s.addText("DON'T", { x: 7.1, y: 1.45, w: 5.3, h: 0.4, fontSize: 18, bold: true, color: RED });
s.addText(bullets([
  'No waitForTimeout / hard sleeps',
  'No CSS or XPath selectors',
  'No if/else flow control in tests',
  'No shared state between tests',
  'No copy-pasted locators (put them in the POM)',
], { size: 13.5 }), { x: 7.2, y: 1.9, w: 5.2, h: 4 });

// ---- How to run locally ----
s = slide('Run It Locally');
codeBox(s, 0.7, 1.3, 12, 3.3, [
  c.m('# one-time setup\n'),
  c.g('npm install'), c.d('\n'),
  c.g('npx playwright install chromium'), c.d('\n\n'),
  c.m('# run\n'),
  c.g('npm test'), c.m('               # full suite, headless\n'),
  c.g('npm run test:smoke'), c.m('     # only @smoke (fast)\n'),
  c.g('npm run test:chrome'), c.m('    # real Chrome, slowed down to watch\n'),
  c.g('npm run test:report'), c.m('    # open the HTML report\n'),
]);
s.addText('Credentials (Admin / admin123) work out of the box — no .env needed for the public demo.', { x: 0.7, y: 4.8, w: 12, h: 0.4, fontSize: 13, italic: true, color: GRAY });

// ---- Writing your first test ----
s = slide('Writing Your First Test');
codeBox(s, 0.7, 1.25, 12, 4.5, [
  c.k('import'), c.d(' { test, expect } '), c.k('from'), c.s(" '../../fixtures/auth.fixture.js'"), c.d(';\n'),
  c.k('import'), c.d(' { AdminPage } '), c.k('from'), c.s(" '../../support/page-objects/AdminPage.js'"), c.d(';\n\n'),
  c.g('test'), c.d('('), c.s("'search finds the Admin user'"), c.d(', '), c.k('async'), c.d(' ({ authenticatedPage }) => {\n'),
  c.d('  '), c.k('const'), c.d(' admin = '), c.k('new'), c.d(' '), c.g('AdminPage'), c.d('(authenticatedPage);\n'),
  c.d('  '), c.k('await'), c.d(' admin.'), c.g('goto'), c.d('();\n'),
  c.d('  '), c.k('await'), c.d(' admin.'), c.g('searchByUsername'), c.d('('), c.s("'Admin'"), c.d(');\n\n'),
  c.m('  // network-first assertion — waits, no sleep\n'),
  c.d('  '), c.k('await'), c.d(' '), c.g('expect'), c.d('(admin.'), c.g('cell'), c.d('('), c.s("'Admin'"), c.d(')).'), c.g('toBeVisible'), c.d('();\n'),
  c.d('});\n'),
]);
s.addText('The fixture logs you in; the page object hides the locators. You focus on the scenario.', { x: 0.7, y: 5.95, w: 12, h: 0.4, fontSize: 13, italic: true, color: GRAY });

// ---- Priorities & tags ----
s = slide('Priorities & Tags');
s.addText(
  bullets([
    { text: 'Risk = probability × impact → P0 (critical) … P3 (low).', bold: true },
    { text: 'P0 — login, validation, dashboard, logout. Must be 100% green to ship.', level: 1, color: RED },
    { text: 'P1 — wrong password, forgot-pw, nav items, admin search. Target ≥ 90%.', level: 1, color: AMBER },
    { text: 'P2 — page-load NFR, no-records, reset. Target ≥ 50%.', level: 1 },
    'Tag the smoke-critical ones @smoke — they run on every push and gate fast.',
    'Add an inline // P0 / // P1 comment so reviewers see intent.',
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- CI ----
s = slide('What Runs in CI');
s.addText(
  bullets([
    { text: 'On every push to main:', bold: true },
    { text: 'test (2 parallel shards) + smoke (@smoke only)', level: 1 },
    { text: 'On every pull request:', bold: true },
    { text: 'test (2 shards) + burn-in (suite ×3 to catch flakiness before merge)', level: 1 },
    { text: 'Nightly at 02:00 UTC:', bold: true },
    { text: 'full suite as a health/uptime canary for the demo site', level: 1 },
    { text: 'HTML report + traces + screenshots uploaded as artifacts (7 days).', color: GREEN_D },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- Debugging failures ----
s = slide('Debugging a Failure');
s.addText(
  bullets([
    { text: 'Read the error + assertion message first — they say what was expected.', bold: true },
    { text: 'Open the HTML report:  ', bold: false },
    { text: 'npm run test:report — step timeline, DOM snapshots, network.', level: 1 },
    { text: 'Trace on retry: drag the trace.zip into trace.playwright.dev for a time-travel view.', level: 1 },
    { text: 'Screenshot on failure is auto-saved under test-results/.', level: 1 },
    { text: 'Watch it live:  npm run test:chrome  (real Chrome, slowed down).', level: 1 },
    { text: 'Is it the demo site? Re-run; CI retries twice. Flaky externally ≠ our bug.', color: AMBER },
  ]),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- Coverage & gate ----
s = slide('Coverage & the Release Gate');
const cov = [
  ['Priority', 'Covered', 'Target', 'Status'],
  ['P0', '6 / 6 (100%)', '100%', 'PASS'],
  ['P1', '6 / 7 (85.7%)', '≥ 90%', 'CONCERNS'],
  ['P2', '100%', '≥ 50%', 'PASS'],
];
s.addTable(cov, { x: 0.9, y: 1.4, w: 11.5, colW: [2.4, 3.4, 2.6, 3.1], fontSize: 14, color: TEXT, align: 'center', valign: 'middle', border: { type: 'solid', color: 'E2E8F0', pt: 1 }, rowH: 0.62 });
s.addText(
  bullets([
    'Gate today: CONCERNS — one P1 (session-not-persisted) is an ATDD scaffold awaiting activation.',
    'Activating it → P1 hits 100% → gate becomes PASS.',
    'Test Review score: 92.7 / 100. NFRs: Perf/Reliability/Maintainability PASS.',
  ], { size: 14 }),
  { x: 0.7, y: 3.7, w: 12, h: 2.6 },
);

// ---- Demo plan ----
s = slide('Live Demo Plan');
s.addText(
  bullets([
    { text: '1. Run the smoke suite — green in seconds (npm run test:smoke).' },
    { text: '2. Watch a login + admin search in real Chrome (npm run test:chrome).' },
    { text: '3. Open the HTML report — walk a passing test’s timeline.' },
    { text: '4. Break a selector on purpose → show the failure + screenshot + trace.' },
    { text: '5. Write a tiny new test together using a page object.' },
    { text: '6. Show the CI run on GitHub (shards, smoke, artifacts).' },
  ], { size: 15 }),
  { x: 0.7, y: 1.3, w: 12, h: 5.4 },
);

// ---- Thank you / resources ----
const ty = pptx.addSlide();
ty.background = { color: DARK };
ty.addShape(pptx.ShapeType.rect, { x: 0, y: 3.4, w: W, h: 0.08, fill: { color: GREEN } });
ty.addText('Questions?', { x: 0.7, y: 2.2, w: 12, h: 1, fontSize: 44, bold: true, color: 'FFFFFF' });
ty.addText('Let’s add your next test together.', { x: 0.7, y: 3.6, w: 12, h: 0.6, fontSize: 20, color: GREEN });
ty.addText(
  [
    { text: 'Repo:  github.com/AlexAI22/BMadTestArhitect\n', options: { fontSize: 14, color: 'CBD5E1' } },
    { text: 'Start here:  docs/tea-academy-summary.md  ·  README.md', options: { fontSize: 14, color: 'CBD5E1' } },
  ],
  { x: 0.7, y: 4.7, w: 12, h: 1 },
);

const OUT = 'docs/OrangeHRM-QA-Team-Presentation.pptx';
await pptx.writeFile({ fileName: OUT });
console.log('Wrote ' + OUT);
