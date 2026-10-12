# Quality Workshop

Choose tests by risk, then prove they detect compiling behavioral defects.
This independent React/HTTP exercise uses fictional workshop requests only.
It is not a durable booking service, authorization system or payment integration.
No earlier repository or external account is required.

## Install and run

```sh
bun install --frozen-lockfile
bun run check
bun run dev
```

The app uses 127.0.0.1:4230 and the fixture receiver uses 127.0.0.1:4231.
Stop with Ctrl+C before browser commands: their configuration starts its own
server and refuses to borrow an existing one. Dependency/browser installation
needs internet; runtime requests remain local. Do not enter personal data.

```sh
bunx playwright install chromium
bun run browser
bun run gate
bun run coverage
```

`test` invokes Vitest through Bun, not the separate `bun test` runner. `check`
runs strict typecheck, lint, unit/controller/component cases and production
build. `gate` also runs the real-browser suite. Coverage uses Istanbul source
instrumentation, compatible with this Bun runtime; V8-specific coverage cannot
be assumed on Bun. Coverage is diagnostic, not a universal pass percentage.

## Understand the task

Titles contain 2–40 characters after trimming; seats are whole numbers 1–3.
Model input requires a number, not a numeric string. The form uses native
constraints and the receiver validates independently. A successful reply is
decoded before acceptance. The acknowledgement list is page-local; reload
clears it. The fixture does not store real bookings or guarantee durability.

Receiver fixture choices intentionally produce success, 503 rejection or a
malformed receipt. Changing that diagnostic choice disposes the old form and
resets its draft; record setup before entering test input. Rejection within
one owner preserves the draft and permits retry. Cancellation stops local
waiting and returns focus; it cannot promise receiver rollback. Newer drafts
must not be cleared merely because an older submitted snapshot was accepted.

## Inspect the test boundaries

- Model: requirements-based numeric/representation/title cases and decoding.
- Controller: deferred success/rejection, overlapping intent, obsolete cleanup
  and disposal; a replacement intentionally ignores abort.
- Component: actual mounted form with a controlled sender in Happy DOM;
  rejection/retry, accepted snapshot/new draft and cancellation focus.
- Clock: actual hint scheduler at 249/250 ms and cancelled ownership.
- Browser: real Chromium and loopback HTTP validation/acceptance, keyboard,
  503/malformed/network recovery, literal text and narrow wrapping. One delayed
  reply is explicitly intercepted for controlled cancellation evidence.
- Automated accessibility: axe on initial and rejection states, alongside
  concrete keyboard/task assertions. Not a conformance or real-speech claim.

Tests restore owned clocks/mocks and mounted trees. Each browser case has a
new context; the stateless receiver avoids a shared booking database. Chromium
desktop and narrow are the executed matrix, not every engine or actual device.
The zero-retry configuration preserves first-attempt evidence. Failure traces
and screenshots live under test-results; HTML reports under playwright-report.
Use fictional data, and apply access/retention review before collecting real traces.

## Strengthen the deliberately weak project suite

```sh
bun run project:check
```

The initial failure is intentional. Edit `project/regression.test.tsx`, not the
reference source or challenge expectations. Your suite must pass on correct
source and fail on four isolated, compiling variations: exclusive upper bound,
erased rejected draft, unguarded obsolete success and a missing field label.
Temporary copies and JSON reports are retained under tmp/project-challenge-*;
the original source is not mutated. Import/parse errors do not count as a
behavioral failed assertion. Four detected variations are not a complete
mutation score. Explain the specific oracle and failure for each.

Add one independent domain/lifetime case beyond these four and prove its own
red-to-green result in a disposable copy. Do not simply compare source strings
or change expected behavior to fit a faulty output. Keep the reference gate
and project evidence separately named. Fill QUALITY_PLAN.md with risks, cases,
replacement boundaries, environments, manual work and a release decision.

## Review coverage and CI honestly

Coverage includes declared source files even when they were not reached by this
Vitest suite. An API gap here and a passing separate browser HTTP case have
different scopes; do not sum them into an invented complete metric. Read actual
assertions and review a wrong implementation, not only the percentage.

The supplied workflow is for placing this extracted exercise at a practice
repository root. It installs the lockfile and Linux Chromium dependencies,
runs the same gate and uploads fictional diagnostic artifacts with seven-day
retention. It has read-only repository permissions, pinned action commits and
no deployment credentials. Local/YAML checks are not an executed hosted job.
Do not publish it or claim live CI without the necessary repository authority.

Manual exploration, enlarged text/zoom, supported-engine and actual
assistive-technology combinations belong in the plan. Unperformed checks stay
explicitly outstanding with an owner/next action; a green scanner or DOM query
cannot stand in for actual announcements or a production trust boundary.
