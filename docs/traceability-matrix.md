# Requirements Traceability Matrix (Phase 1)

**Workflow:** 9 — Requirements Tracing (TR)
**Maps:** every scenario in [test-design-qa.md](./test-design-qa.md) → its test.
**Last run:** 14 passed, 3 skipped (ATDD red-phase) — full suite, chromium.

Status legend: **FULL ✅** = scenario fully automated and passing ·
**PARTIAL ◐** = scenario partly covered · **PLANNED ⏳** = authored as ATDD
red-phase scaffold (skipped) · **NONE ✖** = no coverage.

---

## Coverage matrix

| Req ID | Scenario | Priority | Test File | Test (line) | Status |
|--------|----------|:--------:|-----------|-------------|:------:|
| REQ-01 | Valid login → dashboard | P0 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `valid credentials land on the dashboard @smoke` (:25) | FULL ✅ |
| REQ-02 | Invalid credentials | P0 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `invalid credentials show "Invalid credentials" error` (:38) | FULL ✅ |
| REQ-03 | Empty username | P0 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `empty username triggers required-field validation` (:49) | FULL ✅ |
| REQ-04 | Empty password | P0 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `empty password triggers required-field validation` (:61) | FULL ✅ |
| REQ-05 | Correct user, wrong password | P1 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `correct user with wrong password shows error` (:73) | FULL ✅ |
| REQ-06 | Forgot Password navigates | P1 | [login.spec.ts](../tests/e2e/auth/login.spec.ts) | `Forgot Password link navigates to the reset request page` (:84) | FULL ✅ |
| REQ-07 | Dashboard loads after login | P0 | [dashboard.spec.ts](../tests/e2e/dashboard/dashboard.spec.ts) | `dashboard loads with the correct title after login @smoke` (:13) | FULL ✅ |
| REQ-08 | Navigation items visible | P1 | [dashboard.spec.ts](../tests/e2e/dashboard/dashboard.spec.ts) | `primary navigation menu items are visible` (:28) | FULL ✅ |
| REQ-09 | Logout redirects to login | P0 | [logout.spec.ts](../tests/e2e/auth/logout.spec.ts) | `logout redirects to the login page @smoke` (:13) | FULL ✅ |
| REQ-10 | Login page < 3 s | P2 | [nfr-assessment.md](./nfr-assessment.md) | Performance audit (trace timing) | PARTIAL ◐ |
| REQ-11 | Session not persisted after logout | P1 | [login-atdd.spec.ts](../tests/e2e/auth/login-atdd.spec.ts) | `session cookie is cleared after logout` / `protected route…redirects` (:48, :73) | PLANNED ⏳ |
| REQ-12 | Admin System Users page loads | P1 | [admin.spec.ts](../tests/e2e/admin/admin.spec.ts) | `System Users page loads with heading, table and records @smoke` (:22) | FULL ✅ |
| REQ-13 | Search by username returns match | P1 | [admin.spec.ts](../tests/e2e/admin/admin.spec.ts) | `search by username "Admin" returns the Admin user` (:37) | FULL ✅ |
| REQ-14 | Unknown username → No Records Found | P2 | [admin.spec.ts](../tests/e2e/admin/admin.spec.ts) | `search for a non-existent username shows "No Records Found"` (:51) | FULL ✅ |
| REQ-15 | Reset restores full list | P2 | [admin.spec.ts](../tests/e2e/admin/admin.spec.ts) | `reset clears the filter and restores the full list` (:62) | FULL ✅ |
| REQ-16 | Add navigates to Add User form | P1 | [admin.spec.ts](../tests/e2e/admin/admin.spec.ts) | `Add button navigates to the Add User form` (:77) | FULL ✅ |

---

## Coverage summary

| Priority | Required | Covered (FULL) | % | Target met? |
|----------|:--------:|:--------------:|:--:|:-----------:|
| **P0** | 6 (REQ-01,02,03,04,07,09) | 6 | **100%** | ✅ (≥100%) |
| **P1** | 7 (REQ-05,06,08,11,12,13,16) | 6 | **85.7%** | ⚠️ (target ≥90%) |
| **P2** | 3 (REQ-10,14,15) | 2 FULL / 1 PARTIAL | **100%*** | ✅ (≥50%) |
| **P3** | 0 | 0 | n/a | ✅ |

\* REQ-14/REQ-15 are FULL automated; REQ-10 is covered as an NFR audit (PARTIAL),
comfortably satisfying the P2 ≥50% threshold.

**P1 note:** 6 of 7 P1 scenarios are FULL automated and passing. The only gap is
REQ-11, which is authored (full assertion logic) but skipped as an ATDD red-phase
scaffold pending activation. Counting it brings P1 authored coverage to 100%;
counting only *active passing* tests yields 85.7%. The gate decision below uses
active-passing coverage (85.7% → CONCERNS band).

---

## Gaps & actions

| Gap | Req | Action | Tracked in |
|-----|-----|--------|------------|
| Session-not-persisted not active | REQ-11 | Activate ATDD AT-02 / AT-03 after confirming cookie/redirect behaviour | [atdd-implementation-checklist.md](./atdd-implementation-checklist.md) |
| Login-page-load has no hard assert | REQ-10 | Optionally add a perf assertion (`expect(timing).toBeLessThan(3000)`) | [nfr-assessment.md](./nfr-assessment.md) |

The go/no-go decision derived from this matrix is in
[gate-decision.md](./gate-decision.md).
