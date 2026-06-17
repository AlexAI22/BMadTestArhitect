# Test Design — OrangeHRM TEA Demo

**Workflow:** 3 — Test Design (TD)
**Method:** TEA risk-based design — risk = probability × impact, banded P0–P3.
**System under test:** https://opensource-demo.orangehrmlive.com
**Browser automation:** MCP mode (`tea_browser_automation: "mcp"`).

---

## 1. Priority model

| Band | Meaning | Coverage target |
|------|---------|-----------------|
| **P0** | Critical — entry point, security gate, core post-login state. Must pass to ship. | 100% |
| **P1** | High — common failure modes, recovery paths, feature visibility. | ≥ 90% |
| **P2** | Medium — NFRs and secondary behaviour. | ≥ 50% |
| **P3** | Low — cosmetic / rarely exercised. | ≥ 20% |

Scoring heuristic: `probability` (1–3) × `impact` (1–3). 7–9 → P0, 5–6 → P1,
3–4 → P2, 1–2 → P3. Security-relevant items are floored at P1.

---

## 2. Scenario catalogue

| Req ID | Scenario | Prob. | Impact | Score | Priority | Justification |
|--------|----------|:-----:|:------:|:-----:|:--------:|---------------|
| REQ-01 | Login with valid credentials (Admin/admin123) | 3 | 3 | 9 | **P0** | Critical path, system entry point |
| REQ-02 | Login with invalid credentials | 3 | 3 | 9 | **P0** | Security gate |
| REQ-03 | Login with empty username | 3 | 3 | 9 | **P0** | Input validation |
| REQ-04 | Login with empty password | 3 | 3 | 9 | **P0** | Input validation |
| REQ-05 | Login with correct user, wrong password | 3 | 2 | 6 | **P1** | Common failure mode |
| REQ-06 | Forgot Password link navigates correctly | 2 | 2 | 4→**P1** | **P1** | User recovery path (security-floored) |
| REQ-07 | Dashboard loads after login | 3 | 3 | 9 | **P0** | Core post-login state |
| REQ-08 | Navigation items visible on dashboard | 2 | 2 | 4→**P1** | **P1** | Feature discoverability |
| REQ-09 | Logout redirects to login page | 3 | 3 | 9 | **P0** | Session security |
| REQ-10 | Login page loads in < 3 seconds | 2 | 2 | 4 | **P2** | Performance NFR |
| REQ-11 | Session not persisted after logout | 2 | 3 | 6 | **P1** | Security |

**Counts:** **P0 = 6** (REQ-01, 02, 03, 04, 07, 09), **P1 = 4** (REQ-05, 06, 08, 11), **P2 = 1** (REQ-10), **P3 = 0**.

---

## 3. Detailed acceptance criteria

| Req ID | Given / When / Then |
|--------|---------------------|
| REQ-01 | Given the login page, when Admin/admin123 is submitted, then the URL becomes `/dashboard/index` and the "Dashboard" heading is visible. |
| REQ-02 | Given the login page, when bad credentials are submitted, then an alert reads "Invalid credentials". |
| REQ-03 | Given the login page, when username is empty, then a "Required" validation message appears and no navigation occurs. |
| REQ-04 | Given the login page, when password is empty, then a "Required" validation message appears and no navigation occurs. |
| REQ-05 | Given a valid username with a wrong password, then an "Invalid credentials" alert appears. |
| REQ-06 | Given the login page, when "Forgot your password?" is clicked, then the URL contains `requestPasswordResetCode`. |
| REQ-07 | Given a successful login, then the dashboard renders with title matching `OrangeHRM` and the "Dashboard" heading. |
| REQ-08 | Given the dashboard, then nav items Admin, PIM, Leave, Time and Dashboard are visible. |
| REQ-09 | Given an authenticated session, when the user logs out, then the URL returns to `/auth/login` and the Login button is visible. |
| REQ-10 | Given a cold load of the login page, then it is interactive in < 3s. |
| REQ-11 | Given a logout, then the prior session cannot be replayed (cookie cleared / protected route redirects to login). |

---

## 4. NFR thresholds

| NFR | Threshold | Measurement source |
|-----|-----------|--------------------|
| Login **page load** | < 3 s to interactive | Playwright navigation timing / trace |
| **Login response** (submit → dashboard) | < 2 s | Trace timing on REQ-01 |
| Test **reliability** | 100% pass across 3 burn-in iterations | CI `burn-in` job |
| Test file **size** | < 300 lines per spec | Static review |

See [nfr-assessment.md](./nfr-assessment.md) for measured evidence and decisions.

---

## 5. Sprint 0 setup checklist

- [ ] Node 20 installed (`nvm use` reads [.nvmrc](../.nvmrc)).
- [ ] `npm install` completed.
- [ ] `npx playwright install chromium` completed.
- [ ] `.env` created from [.env.example](../.env.example) with `BASE_URL`,
      `ADMIN_USER`, `ADMIN_PASSWORD`.
- [ ] MCP server configured: `npx @playwright/mcp@latest --headless --browser chromium`
      and registered with the MCP client (see [README](../README.md)).
- [ ] CI secrets set: `BASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`.
- [ ] Smoke check green: `npm run test:smoke`.

---

## 6. Known risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Demo-site flakiness** — public OrangeHRM instance can be slow / reset | High | Med | `retries: 2` on CI, network-first waits, burn-in job, generous nav timeout |
| **Shared credentials** — Admin/admin123 is public and may be changed/locked | Med | High | Credentials via env/secrets (swap without code change); fail-fast assertion on login |
| **Periodic data reset** of the demo site | Med | Low | Tests assert on stable UI (auth + nav), not on volatile HR records |
| **Network egress** required to a third-party host | Med | Med | Nightly schedule + retries; document as environmental, not a product defect |

---

## 7. Out of scope (this demo)

- HR business workflows (PIM record CRUD, leave approval) — beyond the auth/session
  risk focus.
- Cross-browser matrix — chromium only (extendable in `playwright.config.ts`).
- Load / stress testing — only single-user NFR budgets are assessed.
