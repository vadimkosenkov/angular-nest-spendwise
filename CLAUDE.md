# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal finance app (expense tracking, budgeting, analytics). Currently only the frontend and a throwaway mock backend exist — the README's target stack (NestJS, RabbitMQ, PostgreSQL, Prisma) is aspirational, not yet in the repo.

Nx monorepo with three projects: `client-app` (Angular 21 + Ionic 8, standalone components/signals), `shared-types` (plain TS library of interfaces/enums shared between GraphQL client code and the eventual backend), `client-app-e2e` (Playwright, targets auto-inferred by the Nx Playwright plugin). `bff-mock/` is a separate plain Node package (not an Nx project) — an in-memory Apollo Server GraphQL mock standing in for the real backend.

## Commands

Install once: `npm install` (postinstall auto-installs `bff-mock`'s own deps separately).

Local dev needs two processes running together:
- `npm start` — Angular dev server (`client-app`) at http://localhost:4200
- `npm run start:bff` — mock GraphQL backend at http://localhost:8080/graphql. Data is in-memory and resets on every restart.

Build: `npm run build` (or `npx nx build client-app`)

Lint: `npm run lint` (or `npx nx lint client-app`)

Test (Vitest, via Angular's `@angular/build:unit-test` builder):
- `npx nx test client-app` — full suite
- `npx nx test client-app --include <path/to/*.spec.ts>` — single file
- `npx nx test client-app --filter "<pattern>"` — filter by test/suite name (regex)

E2e: `npx nx e2e client-app-e2e` (Playwright)

`client-app/vitest.config.ts` inlines `@ionic/*` packages for the Vitest runner (`server.deps.inline`). Without it, any spec that touches a real Ionic component (via `TestBed`) fails with `Directory import '.../@ionic/core/components' is not supported` — Node's ESM loader can't resolve Ionic's directory imports the way the app's own esbuild-based bundler can. Don't remove this without re-verifying `nx test` still passes.

## Architecture

**Feature module layout** (`client-app/src/app/features/tabs/<feature>/`): each feature follows the same shape —
- `<feature>.component.ts` — standalone Angular component, injects the store, exposes its state as `protected readonly` fields for the template.
- `<feature>.store.ts` — `@Injectable({ providedIn: 'root' })`, owns state as a private `signal(...)`, exposes it publicly via `.asReadonly()`. Never expose a raw `WritableSignal` — components must not be able to `.set()`/`.update()` state that isn't theirs.
- `<feature>.service.ts` — thin Apollo wrapper, one method per query/mutation, built on `executeQuery`/`executeMutation` from `shared/utils/graphql.helpers.ts`.
- `<feature>.queries.ts` / `<feature>.mutations.ts` — `gql` documents.

**`LoadingState`** (`shared/utils/loading-state.ts`) is the shared helper every store's mutation/query method runs through via `.execute(observable, handlers, errorMessage, options)`. It tracks `loading`/`error` signals and, when called with `{ global: true }`, also drives `GlobalLoadingService` (`core/loading/global-loading.service.ts`) — a reference-counted wrapper around Ionic's `LoadingController` that shows one shared overlay across overlapping in-flight requests. `LoadingState` is a plain class, not `@Injectable`; it's only ever constructed with `new LoadingState()` from a field initializer (e.g. `private readonly state = new LoadingState();`), which is what keeps its internal `inject(GlobalLoadingService)` call inside an active injection context. Constructing it anywhere else (inside a method, a callback, etc.) throws `NG0203`.

**GraphQL error handling** lives in `core/graphql/graphql.provider.ts`'s Apollo error link, which distinguishes three cases and logs each differently: `CombinedGraphQLErrors` (GraphQL-level errors), `ServerError` (non-2xx HTTP — parses the response body to surface the real message instead of Apollo's generic "Response not successful" string), and everything else (network errors).

**Routing** (`app.routes.ts`): all feature components are lazy-loaded via `loadComponent`. Tabs live under `/tabs/*` inside `TabsComponent` (`ion-tabs`), gated by `onboardingRedirectGuard`, which redirects to `/onboarding` unless `localStorage["onboardingCompleted"] === "true"`.

**TypeScript style conventions** (apply to new/touched code, enforced during review — see `.claude/skills/review-flow` if present): explicit `private`/`protected`/`public` on every class field, with `readonly` whenever a field is assigned once and never reassigned (`.set()` on a signal doesn't count as reassignment). `protected` for anything only the component's own template reads; `public` only for fields another class actually consumes. Don't add an explicit type/generic where TypeScript already infers it correctly from `inject(X)`, `new X()`, or `signal(x)` — but do supply the generic when the inferred type would be too narrow (e.g. `signal(null)` → `signal<T | null>(null)`).
