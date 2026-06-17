# ATDD Implementation Checklist

**Workflow:** 5 — ATDD (AT)
**Source scaffolds:** [`tests/e2e/auth/login-atdd.spec.ts`](../tests/e2e/auth/login-atdd.spec.ts)
**Project:** OrangeHRM TEA Demo

These are the red-phase acceptance tests authored ahead of validation. Each is
currently `test.skip(...)` with full assertion logic. Activate a test by removing
its `test.skip` once the feature/assertion is confirmed against the environment,
then move its status to ✅ Done.

| # | Test (acceptance criterion) | Priority | Owner | Est. effort | Status |
|---|-----------------------------|----------|-------|-------------|--------|
| AT-01 | Forgot password flow leads to the reset page — reset form (Username + Reset Password + Cancel) is rendered | P1 | _unassigned_ | 0.5 day | [ ] Not started |
| AT-02 | Session cookie cleared after logout — `orangehrm` cookie is removed/emptied post-logout | P1 | _unassigned_ | 1 day | [ ] Not started |
| AT-03 | Protected route without auth redirects to login — redirect guard bounces unauthenticated dashboard access | P0 | _unassigned_ | 0.5 day | [ ] Not started |

## Activation steps (per test)

1. Manually confirm the behaviour on the live site / target environment.
2. Remove `test.skip(` and restore the test to `test(`.
3. Run locally: `npx playwright test login-atdd.spec.ts --headed`.
4. Add the activated test to [`docs/traceability-matrix.md`](./traceability-matrix.md).
5. Update this checklist status to `[x] Done`.

## Notes & risks

- **AT-02** depends on the exact session cookie name (`orangehrm`). Verify the
  cookie name against the live `Set-Cookie` header before activating; adjust the
  assertion if the demo site changes it.
- **AT-03** assumes a server-side redirect guard exists. If the demo site serves
  a client-rendered shell first, widen the `waitForURL` to tolerate an
  intermediate state (still no hard waits).
- All scaffolds already comply with TEA standards (network-first, role-based
  locators, no hard waits) so activation is assertion-confirmation only.
