# OrangeHRM TEA Demo — Playwright + TypeScript

A production-ready end-to-end test automation suite for the public
[OrangeHRM demo site](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login),
built by executing all **9 core workflows** of the BMad Method
**TEA (Test Engineering Architect)** framework.

- **Framework:** Playwright + TypeScript (strict mode)
- **Browser automation mode:** MCP (Model Context Protocol) — `tea_browser_automation: "mcp"`
- **Pattern:** Page Object Model, isolated-context auth fixture, network-first synchronization
- **Reference:** https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/

**Latest run:** ✅ 14 passed · 3 skipped (ATDD red-phase) · 0 failed (chromium).

---

## Project description

The suite validates the OrangeHRM authentication boundary, dashboard state and
session security using risk-based test design (P0–P3). Everything is produced and
governed by the TEA workflows: teaching → design → scaffold → CI → ATDD → automate
→ review → NFR audit → traceability & release gate.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20.x | Pinned in [.nvmrc](./.nvmrc) — run `nvm use` |
| npm | bundled with Node 20 | |
| Playwright browsers | chromium | installed via the command below |

---

## Setup

```bash
# 1. Use the pinned Node version
nvm use            # reads .nvmrc (Node 20)

# 2. Install dependencies
npm install

# 3. Install the chromium browser
npx playwright install chromium

# 4. Configure environment
cp .env.example .env          # macOS/Linux
# Copy-Item .env.example .env # Windows PowerShell
```

`.env` keys (defaults work out of the box against the public demo):

```
BASE_URL=https://opensource-demo.orangehrmlive.com
ADMIN_USER=Admin
ADMIN_PASSWORD=admin123
```

---

## How to run

### Local

```bash
npm test               # full suite
npm run test:smoke     # only @smoke tagged tests
npm run test:burn-in   # repeat each test 3x, no retries (flakiness check)
npm run test:headed    # watch it run in a real browser
npm run test:ui        # Playwright UI mode
npm run test:report    # open the last HTML report
npm run typecheck      # tsc --noEmit (strict)
```

### CI

GitHub Actions ([.github/workflows/test.yml](./.github/workflows/test.yml)) runs on
push to `main`, on every pull request, and nightly at 02:00 UTC:

- **test** — full suite across **2 shards** (matrix).
- **burn-in** — runs the suite **3×** on pull requests to detect flakiness.
- **smoke** — runs only `@smoke` tests on every push.

It caches npm and Playwright browsers, installs chromium with `--with-deps`, and
uploads the HTML report + traces/screenshots as artifacts (7-day retention).

**Required repository secrets:** `BASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`.

---

## Folder structure

```
orangehrm-tea-demo/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.ts          # P0/P1 login coverage (Automate)
│   │   │   ├── login-atdd.spec.ts     # ATDD red-phase scaffolds (skipped)
│   │   │   └── logout.spec.ts         # P0 logout (uses auth fixture)
│   │   ├── dashboard/
│   │   │   └── dashboard.spec.ts      # P0/P1 dashboard coverage
│   │   └── admin/
│   │       └── admin.spec.ts          # P1/P2 System Users (search/reset/add)
│   ├── fixtures/
│   │   └── auth.fixture.ts            # isolated-context authenticatedPage fixture
│   └── support/
│       └── page-objects/
│           ├── LoginPage.ts
│           ├── DashboardPage.ts
│           └── AdminPage.ts
├── docs/                              # all TEA workflow artifacts (see map below)
├── .github/workflows/test.yml         # CI: test (2 shards) + burn-in + smoke
├── playwright.config.ts               # baseURL, chromium headless, traces, MCP note
├── .env.example
├── .nvmrc                             # Node 20
├── package.json
├── tsconfig.json                      # strict mode
└── README.md
```

---

## TEA workflow map

| # | Workflow | Trigger | Output file(s) |
|---|----------|---------|----------------|
| 1 | Teach Me Testing | TMT | [docs/tea-academy-summary.md](./docs/tea-academy-summary.md) |
| 2 | Framework Setup | TF | Full scaffold (config, POMs, fixture, this README) |
| 3 | Test Design | TD | [docs/test-design-qa.md](./docs/test-design-qa.md) |
| 4 | CI/CD Integration | CI | [.github/workflows/test.yml](./.github/workflows/test.yml) + `package.json` scripts |
| 5 | ATDD | AT | [tests/e2e/auth/login-atdd.spec.ts](./tests/e2e/auth/login-atdd.spec.ts) + [docs/atdd-implementation-checklist.md](./docs/atdd-implementation-checklist.md) |
| 6 | Automate | TA | [login.spec.ts](./tests/e2e/auth/login.spec.ts), [logout.spec.ts](./tests/e2e/auth/logout.spec.ts), [dashboard.spec.ts](./tests/e2e/dashboard/dashboard.spec.ts), [admin.spec.ts](./tests/e2e/admin/admin.spec.ts) |
| 7 | Test Review | RV | [docs/test-review-report.md](./docs/test-review-report.md) |
| 8 | NFR Evidence Audit | NR | [docs/nfr-assessment.md](./docs/nfr-assessment.md) |
| 9 | Requirements Tracing | TR | [docs/traceability-matrix.md](./docs/traceability-matrix.md) + [docs/gate-decision.md](./docs/gate-decision.md) |

> The artifacts in `docs/` above were authored as a hand-built demonstration of
> the TEA workflows. The repo **also** has the real BMAD TEA agent installed (see
> next section), whose workflows regenerate equivalent artifacts under
> `_bmad-output/test-artifacts/`.

---

## BMAD Test Architect agent (Murat)

This project has the **BMad Method** installed with the **Test Architect (TEA)**
module — so the 9 workflows can be driven by the AI agent, not just read as docs.

- **Installed:** BMad Core v6.8.0 + Test Architect v1.19.0
  (`npx bmad-method install --modules tea --tools claude-code`).
- **Layout:** `_bmad/` (framework + `_bmad/tea/config.yaml`), `.claude/skills/`
  (22 agent skills), `_bmad-output/test-artifacts/` (generated outputs, gitignored).
- **The agent:** **Murat** — "Master Test Architect & Quality Advisor". Activate by
  invoking the `bmad-tea` skill (or ask for "Murat" / "the Test Architect").
- **Browser automation:** `tea_browser_automation: mcp` in `_bmad/tea/config.yaml`
  (matches this project's MCP-driven design).

### Workflow skills (BMAD trigger → Claude Code skill)

| Workflow | Trigger | Skill |
|----------|---------|-------|
| Teach Me Testing | TMT | `bmad-teach-me-testing` |
| Framework Setup | TF | `bmad-testarch-framework` |
| Test Design | TD | `bmad-testarch-test-design` |
| CI/CD Integration | CI | `bmad-testarch-ci` |
| ATDD | AT | `bmad-testarch-atdd` |
| Automate | TA | `bmad-testarch-automate` |
| Test Review | RV | `bmad-testarch-test-review` |
| NFR Evidence Audit | NR | `bmad-testarch-nfr` |
| Requirements Tracing | TR | `bmad-testarch-trace` |

> Optional: full agent activation runs a Python resolver
> (`_bmad/scripts/resolve_customization.py`); without Python the skill falls back
> to reading its `customize.toml` directly, so it still works.

---

## MCP server configuration

This project is configured for **MCP browser automation** so an AI agent (e.g.
Claude Code) can drive a live browser via the Playwright MCP server while CI runs
the same specs deterministically.

**Start the MCP server:**

```bash
npx @playwright/mcp@latest --headless --browser chromium
```

**Register with an MCP client:** this repo ships a ready [.mcp.json](./.mcp.json) at
the project root (Claude Code auto-loads it), registering the Playwright MCP server
against **real Google Chrome**:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chrome"]
    }
  }
}
```

The runtime contract (baseURL, chromium, headless, traces) lives in
[playwright.config.ts](./playwright.config.ts) and is shared by both the MCP server
and `npx playwright test`, so generated and committed tests behave identically. See
the MCP note block at the top of that file for details.

---

## Quality standards (enforced)

- ❌ No `waitForTimeout` / hard waits — network-first only (`waitForURL`, `expect().toBeVisible()`).
- ❌ No `if/else` flow control in test bodies.
- ❌ No CSS / XPath selectors — `getByRole` / `getByLabel` / `getByPlaceholder` only.
- ✅ Page Object Model for all UI interaction.
- ✅ Parallel-safe, self-contained tests with explicit assertion messages.
- ✅ Every test file < 300 lines.

---

## Known issues

- **Demo-site flakiness.** The public OrangeHRM instance is shared and
  network-dependent. Mitigated by `retries: 2` on CI, network-first waits, and the
  burn-in job. A failure may be environmental rather than a product defect.
- **Shared credentials.** `Admin/admin123` is public and could be changed or
  locked on the demo host. Credentials are injected via env/secrets so they can be
  swapped without code changes.
- **Deferred P1 (REQ-11).** Session-not-persisted deep assertions are authored as
  ATDD red-phase scaffolds (skipped) pending activation — see
  [docs/gate-decision.md](./docs/gate-decision.md) (gate: **WAIVED**, path to PASS
  documented).
