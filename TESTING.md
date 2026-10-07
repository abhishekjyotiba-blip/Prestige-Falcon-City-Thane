# Permanent regression tests

Use Node.js 22.12 or later. CI uses Node.js 24.

```sh
npm install
npm run lint
npm run test:frontend
npm run test:components
npm run test:server
npx playwright install chromium
npm run test:browser
```

On Linux, use `npx playwright install --with-deps chromium` if browser libraries are missing.

Standard installation no longer needs `--legacy-peer-deps`. The direct esbuild version satisfies Vite's optional peer requirement. The repository has no tracked lockfile, so CI uses `npm install --no-package-lock`, not `npm ci`.

## Browser coverage

Playwright runs the actual production build in desktop and phone Chromium projects. The runner starts an isolated loopback preview on port 4175 and stops it after the suite. It does not use the shared port 3000 preview or start a lead API. Keep port 4175 free.

The production build deliberately sets the obsolete `VITE_LEAD_FORM_READY=true` flag. Public submissions must stay blocked regardless of that flag.

Tests cover real keyboard dialog focus, close/return-focus, draft reset, every enquiry source, contact-free analytics, bypassed and duplicate submission attempts, sticky suppression, tab navigation, schematic marker/list selection and distance-pending labels. Phone emulation is not physical-device or Safari acceptance.

The suite needs no secrets, live Google Maps, generated images, approved geography or production lead destination. It does not prove those external integrations work.

```sh
npm run test:browser -- --project=phone-chromium
npm run test:browser -- --headed
npx playwright show-report
```

Failure screenshots and traces appear in ignored `test-results/` and `playwright-report/`. CI uploads failure evidence for seven days. Use synthetic contacts only.

## Component and hook coverage

Vitest/jsdom covers the shared ephemeral drafts and private lead adapter separately. The private adapter tests mock network responses and never save contacts. Tests protect independent state, source tags, duplicate guards and stable retry identities. Current inline cards open the shared dialog; the suite does not restore obsolete inline submission forms.

Neighbourhood tests use explicitly synthetic records and a mocked map component. They protect roving tab focus and ARIA associations, marker/list synchronization, page/category/data resets and source/date/mode/unit disclosures. These tests do not establish geographic accuracy or Google authorization.

The GitHub workflow runs all permanent suites on pull requests, pushes to `main`, and manual dispatch. A local pass does not prove a remote CI run passed.
