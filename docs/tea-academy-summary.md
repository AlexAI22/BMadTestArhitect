# TEA Academy — Condensed Summary (OrangeHRM TEA Demo)

**Workflow:** 1 — Teach Me Testing (TMT)
**Audience:** anyone cloning this repo for the first time.
**Framework:** BMad Method — Test Engineering Architect (TEA).
**Reference:** https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/

This is the onboarding primer. It distills the 7 TEA Academy sessions and shows
how each is applied concretely in *this* project — a Playwright + TypeScript suite
for the OrangeHRM demo site, driven via the Playwright MCP server
(`tea_browser_automation: "mcp"`).

---

## Session 1 — What TEA is and why we use it for OrangeHRM

**Concept.** TEA (Test Engineering Architect) is a discipline that treats testing
as an *architecture* problem, not an afterthought. It defines a repeatable set of
workflows — from teaching, design and scaffolding through automation, review and a
release gate — so quality is engineered in and decisions are evidence-based.

**Applied here.** OrangeHRM is a public demo HR system. We chose it because it has
a real authentication boundary, a protected dashboard, and recoverable failure
modes — enough surface to demonstrate the full TEA loop without test-data setup.
The whole project is produced by executing the 9 TEA core workflows in order, each
emitting a concrete artifact (see the workflow map in the [README](../README.md)).
Browser automation runs in **MCP mode** so an AI agent can author and maintain
tests against a live session while CI runs the same specs deterministically.

---

## Session 2 — Risk-based testing (P0–P3) applied to login / HR features

**Concept.** Not all tests are equal. TEA prioritizes by **risk = probability ×
impact**, mapped to bands:

- **P0** — critical: must pass to ship (entry point, security gates, core state).
- **P1** — high: common failure modes, recovery paths, key feature visibility.
- **P2** — medium: NFRs and secondary behaviours (e.g. performance budgets).
- **P3** — low: cosmetic / rarely-exercised paths.

**Applied here.** Login and session security carry the most risk, so they are P0:
valid login, invalid credentials, empty username, empty password, dashboard load,
logout. Recovery and discoverability paths (forgot-password, nav visibility,
wrong-password, session-not-persisted) are P1. The "login page < 3s" budget is a
P2 NFR. Full scoring lives in [docs/test-design-qa.md](./test-design-qa.md).

---

## Session 3 — Fixture patterns and network-first patterns used in this project

**Concept.** *Fixtures* provide reusable, isolated test context. *Network-first*
means synchronizing on observable application state (URL changes, responses,
element visibility) instead of arbitrary `waitForTimeout` sleeps — the single
biggest source of flake.

**Applied here.**
- [`tests/fixtures/auth.fixture.ts`](../tests/fixtures/auth.fixture.ts) defines an
  `authenticatedPage` fixture. It logs in as Admin inside its **own isolated
  context** per test and lands on the dashboard — self-contained and parallel-safe.
  (Per-test login is a deliberate reliability choice: the shared demo host expires
  server sessions over a run, so a single long-lived saved session is unreliable.)
- Every interaction waits on state: `page.waitForURL(/\/dashboard\/index/)`,
  `expect(locator).toBeVisible()`, `toContainText(...)`. There is **zero**
  `waitForTimeout` in the suite (a hard rule — see Global Quality Standards).

---

## Session 4 — How test design was applied here

**Concept.** Test design turns prioritized risks into concrete, traceable
scenarios with explicit pass/fail criteria and NFR thresholds, *before* code is
written. It also captures Sprint-0 setup and known risks so execution is smooth.

**Applied here.** [docs/test-design-qa.md](./test-design-qa.md) enumerates 11
scenarios with priority and justification, sets NFR thresholds (page load < 3s,
login response < 2s), provides a Sprint-0 checklist (env vars, MCP server,
Playwright install), and records known risks (demo-site flakiness, shared
credentials). Each scenario gets a REQ ID that is later traced to a test.

---

## Session 5 — How ATDD and Automate were used

**Concept.** **ATDD** (Acceptance Test-Driven Development) writes the acceptance
test *first*, in a failing/red state, so the criterion is unambiguous before
implementation. **Automate** then delivers green, durable tests for behaviour that
already exists.

**Applied here.**
- **ATDD (red phase):** [`login-atdd.spec.ts`](../tests/e2e/auth/login-atdd.spec.ts)
  holds three `test.skip` scaffolds (forgot-password reset page, session-cookie
  cleared, protected-route redirect) with *full* assertion logic — not
  placeholders — tracked in
  [atdd-implementation-checklist.md](./atdd-implementation-checklist.md).
- **Automate (green):** [`login.spec.ts`](../tests/e2e/auth/login.spec.ts),
  [`logout.spec.ts`](../tests/e2e/auth/logout.spec.ts) and
  [`dashboard.spec.ts`](../tests/e2e/dashboard/dashboard.spec.ts) cover all P0/P1
  scenarios using the Page Objects and the `authenticatedPage` fixture.

---

## Session 6 — How Test Review and Trace feed the release gate

**Concept.** Before shipping, TEA runs an objective **Test Review** (scored quality
audit), an **NFR audit** (evidence vs thresholds), and a **Requirements Trace**
(every scenario mapped to a test). Their outputs feed a single **release gate**
decision (PASS / CONCERNS / FAIL / WAIVED) governed by explicit rules.

**Applied here.**
- [test-review-report.md](./test-review-report.md) scores determinism, isolation,
  maintainability and performance.
- [nfr-assessment.md](./nfr-assessment.md) records performance, reliability,
  maintainability and security evidence.
- [traceability-matrix.md](./traceability-matrix.md) maps every REQ to its test.
- [gate-decision.md](./gate-decision.md) applies the gate rules
  (PASS if P0=100%, P1≥90%, Overall≥80%).

---

## Session 7 — 5 key advanced patterns used in the project

1. **Page Object Model (POM).** All UI interaction is encapsulated in
   [`LoginPage.ts`](../tests/support/page-objects/LoginPage.ts) and
   [`DashboardPage.ts`](../tests/support/page-objects/DashboardPage.ts). Specs stay
   declarative; selector churn is absorbed in one place.

2. **Fixtures for authenticated state.** The `authenticatedPage` fixture logs in
   within its own isolated context and lands the test on the dashboard, keeping
   every test self-contained and parallel-safe on the shared demo host.

3. **Network-first synchronization.** `waitForURL`, `waitForResponse`-style waits,
   and web-first `expect(...).toBeVisible()` replace every hard wait, eliminating
   timer-based flake.

4. **Burn-in for flakiness.** `npm run test:burn-in`
   (`--repeat-each=3 --retries=0`) and the CI `burn-in` job run each test 3× on PRs
   to catch non-determinism before merge.

5. **Traceability.** Every scenario carries a REQ ID flowing Design → Test →
   Trace matrix → Gate, so coverage and the go/no-go decision are auditable.

---

### TL;DR for a new contributor

> Read [test-design-qa.md](./test-design-qa.md) to see *what* we test and *why*,
> run `npm test` to see it pass, then read [gate-decision.md](./gate-decision.md)
> to see how we decide it's safe to ship. Never add a `waitForTimeout` or a CSS
> selector — use the Page Objects and network-first waits.
