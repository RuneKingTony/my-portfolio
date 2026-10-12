# Conventions

How code is written in this repo, and which gate rejects it when it isn't. The rules are carried over from EduVault, minus what only a monorepo, an API or Tailwind needs.

**Enforced by** names the gate: an ESLint rule, `tsc`, `prettier`, `knip`, a test, or `review` when nothing static can catch it. Every ESLint rule is `error`: presets that ship `warn` rules go through `asErrors` in `eslint.config.mjs`, which promotes them, and an unused `eslint-disable` is an error too. The React Compiler diagnostics `react-hooks/incompatible-library` and `unsupported-syntax` are off because the repo does not use the compiler.

`npm run validate` runs every gate in the order CI does: `format:check`, `lint`, `typecheck`, `knip`, `test`, `build`, `test:e2e`. The pre-commit hook runs Prettier and ESLint on staged files (lint-staged), then `typecheck`.

## Layout

`src/app/` holds Next.js's own files: `layout.tsx`, `globals.css` and `page.tsx`, which only puts the sections in order. `src/sections/` has one file per page section. `src/features/<feature>/` holds the pieces the sections are built from, each with its components, its pure logic and its `.css`. `src/content/` is everything the page says (one file per line in `lines/`, shapes in `types.ts`, and `network.ts` to put them together). `src/lib/` is code more than one feature uses.

| Convention                                                                                                                                                                 | Enforced by                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Files and folders under `src/` and `e2e/` are `kebab-case`; a role goes in a middle extension (`map-geometry.spec.ts`)                                                     | `check-file/filename-naming-convention`, `check-file/folder-naming-convention`                          |
| Named exports only; the default exports Next.js looks for (`layout.tsx`, `page.tsx`, config files) are the only exceptions                                                 | `no-restricted-syntax` (`ExportDefaultDeclaration`, off for `src/app/**/{layout,page,not-found}.tsx`)   |
| No unused files, exports, dependencies or imports                                                                                                                          | `knip`, `unused-imports/no-unused-imports`, `@typescript-eslint/no-unused-vars` (prefix `_` to opt out) |
| No import cycles, duplicate imports or self-imports                                                                                                                        | `import-x/no-cycle`, `import-x/no-duplicates`, `import-x/no-self-import`                                |
| Logic a feature can test without a browser lives in a pure `.ts` file beside its component (`map-geometry.ts`, `mailto.ts`, `github-repos.ts`); the component only renders | `review`, unit tests                                                                                    |
| Content is data: a line of work is edited in `src/content/lines/<id>.ts`, never in a component                                                                             | `review`                                                                                                |

## TypeScript

| Convention                                                                                                                                                          | Enforced by                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `strict`, with `noUncheckedIndexedAccess`; typescript-eslint's strict and stylistic sets, type-checked                                                              | `tsc`, `typescript-eslint` (`strictTypeChecked`, `stylisticTypeChecked`)                                             |
| Conditions are booleans: no truthiness checks on nullable strings, numbers or objects                                                                               | `@typescript-eslint/strict-boolean-expressions`                                                                      |
| Types, interfaces and classes are `PascalCase`; variables `camelCase`, `PascalCase` (components) or `UPPER_CASE` (constants); functions `camelCase` or `PascalCase` | `@typescript-eslint/naming-convention`                                                                               |
| Object shapes are `interface`; `type` is for unions, intersections, mapped and inferred types                                                                       | `@typescript-eslint/consistent-type-definitions`                                                                     |
| No `enum`; use a const object with `as const` or a string-literal union                                                                                             | `no-restricted-syntax` (`TSEnumDeclaration`)                                                                         |
| Type-only imports are written `import { type X }` / `import type`                                                                                                   | `@typescript-eslint/consistent-type-imports`, `consistent-type-exports`, `no-import-type-side-effects`               |
| Functions stay small: at most 60 lines, complexity 10, cognitive complexity 15, nesting 3, three parameters                                                         | `max-lines-per-function`, `complexity`, `sonarjs/cognitive-complexity`, `max-depth`, `@typescript-eslint/max-params` |
| No nested ternaries; `===` only; no implicit coercion; no reassigned parameters                                                                                     | `no-nested-ternary`, `eqeqeq`, `no-implicit-coercion`, `no-param-reassign`                                           |
| Modern built-ins: `globalThis`, `.at()`, `toSorted()`, `toReversed()`, `replaceAll()`                                                                               | `unicorn` (recommended)                                                                                              |
| Regular expressions can't backtrack super-linearly                                                                                                                  | `regexp/no-super-linear-backtracking`, `sonarjs/super-linear-regex`                                                  |

## React and CSS

| Convention                                                                                                                                                                   | Enforced by                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Function components; Rules of Hooks; complete effect dependencies; no state set synchronously in an effect (derive it, or read outside state through `useSyncExternalStore`) | `react-hooks/*`                                                    |
| No components defined inside components; no array-index keys                                                                                                                 | `react/no-unstable-nested-components`, `react/no-array-index-key`  |
| Buttons have a `type`; `target="_blank"` links carry `rel="noopener noreferrer"`                                                                                             | `react/button-has-type`, `react/jsx-no-target-blank`               |
| Accessible markup: labelled controls, alt text, valid ARIA                                                                                                                   | `jsx-a11y` (recommended)                                           |
| Server components by default; `'use client'` only where the browser is needed (motion, the map's highlight, the board, the theme switch, the contact form)                   | `review`                                                           |
| Each component imports its own co-located `.css`; `src/app/globals.css` keeps only tokens, the two themes and base styles shared by everything                               | `review`                                                           |
| Colours are CSS custom properties defined in `globals.css`; no hex, `rgb()`, `hsl()` or `oklch()` literal in TS or TSX                                                       | `no-restricted-syntax` (colour literals; specs may spell them out) |
| Inline `style` only sets CSS custom properties (`--line`, `--i`), never a design value                                                                                       | `review`                                                           |
| Data from outside (GitHub, live-site checks) is fetched at build time only; `prebuild` clears Next's fetch cache so a build never reuses an earlier build's answers          | `review`                                                           |

## Formatting

| Convention                                                                           | Enforced by                                   |
| ------------------------------------------------------------------------------------ | --------------------------------------------- |
| Prettier: single quotes, 80 columns, ES5 trailing commas, semicolons, two spaces, LF | `prettier` (`format:check`), `.editorconfig`  |
| Node 24 and npm                                                                      | `.nvmrc`, `engines`, CI (`node-version-file`) |

## Testing

| Convention                                                                                                                               | Enforced by                           |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Unit specs sit beside the source as `*.spec.ts` and test pure logic; nothing touches the network (inject `fetch`, as `linkChecker` does) | Vitest config (discovery), `review`   |
| One Playwright smoke test runs against the built `out/`: every section renders, the theme toggles, the console stays clean               | `test:e2e` in CI                      |
| Specs avoid focused or disabled tests, `expect` inside conditionals, duplicate titles and malformed matchers                             | `@vitest/eslint-plugin` (recommended) |
| A refactor keeps the page looking the same: compare full-page screenshots before and after, dark and light, desktop and 375px            | `review`                              |

## Not enforceable by a gate

These need a reviewer. Do not read a green `npm run validate` as proof they hold.

- **The look.** Class names are part of the design; a refactor keeps them, and only a screenshot comparison shows it did.
- **Component design.** Where a piece of logic lives, and whether state belongs on the client at all, are judgement calls.
- **Copy.** Plain first-person English, written for the person reading it.
- **Naming a thing well**, and whether a comment earns its place.

If a rule from these tables keeps being broken in review, promote it: add the narrowest ESLint rule that catches it, make it green, and move its row's **Enforced by** from `review` to the rule.
