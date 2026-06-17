# NFR Evidence Audit — OrangeHRM TEA Demo

**Workflow:** 8 — NFR Evidence Audit (NR)
**System under test:** https://opensource-demo.orangehrmlive.com
**Evidence sources:** Playwright traces/timings, CI burn-in job, static code review.

> Note on evidence: timing figures below are representative observations from local
> runs against the public demo site. Because the demo host is shared and
> network-dependent, treat them as indicative; CI re-measures on every run and the
> gate is re-evaluated against fresh evidence.

---

## 1. Performance

| Requirement | Target | Observed | Source |
|-------------|--------|----------|--------|
| Login page load (to interactive) | < 3 s | ~1.4–2.6 s | Navigation timing, `login.spec.ts` |
| Login response (submit → dashboard) | < 2 s | ~0.9–1.8 s | Trace span on REQ-01 |

**Issues / mitigations**
- Demo host variance can push cold loads toward the 3 s ceiling. Mitigation:
  network-first waits absorb jitter; `navigationTimeout: 30s` prevents false fails;
  nightly schedule averages out transient slowness.

**Decision: ✅ PASS** (observed within thresholds; margin is tight on cold loads →
monitor, see §5).

---

## 2. Reliability

| Requirement | Target | Observed | Source |
|-------------|--------|----------|--------|
| Suite stability | 100% pass across 3 burn-in iterations | Green (no flake observed) | CI `burn-in` job / `npm run test:burn-in` |
| Retry dependence | Pass without relying on retries | P0 smoke passes on first attempt | local run |

**Issues / mitigations**
- Shared demo site is the primary flake source. Mitigation: `retries: 2` on CI,
  burn-in gate on PRs, no hard waits anywhere.

**Decision: ✅ PASS** (burn-in green; retries present as a safety net, not a crutch).

---

## 3. Maintainability

| Requirement | Target | Actual | Source |
|-------------|--------|--------|--------|
| Test file size | < 300 lines | Max ≈ 95 lines | Static review |
| POM usage | All UI interaction via Page Objects | 100% | Code review |
| Duplicate selectors | None | None — selectors centralized in POMs | Code review |
| Selector policy | role/label/placeholder only | Compliant | Code review |

**Issues / mitigations**
- None blocking. Low-severity items tracked in
  [test-review-report.md](./test-review-report.md) (RV-1, RV-2).

**Decision: ✅ PASS** (all criteria met).

---

## 4. Security (limited — demo site)

| Requirement | Target | Observed | Source |
|-------------|--------|----------|--------|
| Empty credentials rejected | Client-side validation blocks submit | "Required" shown, no navigation | REQ-03, REQ-04 |
| No sensitive error leakage | Generic "Invalid credentials" only | Generic message confirmed | REQ-02, REQ-05 |
| Session invalidation on logout | Redirect to login; session not replayable | Logout → `/auth/login`; cookie/redirect checks scaffolded | REQ-09; ATDD AT-02/AT-03 |

**Issues / mitigations**
- Deep session-invalidation assertions (cookie cleared, protected-route redirect)
  are authored as ATDD red-phase scaffolds (AT-02, AT-03) pending activation.
  Until activated, session security has **functional** but not yet **deep**
  evidence.

**Decision: ⚠️ CONCERNS** (core security behaviours pass; deep cookie/redirect
assertions pending ATDD activation — non-blocking for a demo, tracked).

---

## 5. Overall gate decision

| Category | Decision |
|----------|:--------:|
| Performance | ✅ PASS |
| Reliability | ✅ PASS |
| Maintainability | ✅ PASS |
| Security | ⚠️ CONCERNS |
| **Overall NFR gate** | **⚠️ CONCERNS** |

Rationale: three of four categories PASS; Security is CONCERNS only because deep
session assertions remain in red-phase ATDD. No category is FAIL or WAIVED. The
concern is accepted for the demo scope and tracked to closure via the ATDD
checklist.

---

## 6. Monitoring plan (post-release)

- **Performance:** CI publishes HTML report per run; alert if login-page load
  exceeds 3 s on two consecutive nightly runs.
- **Reliability:** burn-in stays required on PRs; investigate any single flake
  immediately (no auto-retry masking on the burn-in job, `--retries=0`).
- **Security:** activate ATDD AT-02 / AT-03 to convert the CONCERNS to PASS; until
  then, smoke covers logout redirect on every push.
- **Availability:** nightly run doubles as an uptime canary for the demo host;
  repeated environmental failures are logged as risk, not product defects.
