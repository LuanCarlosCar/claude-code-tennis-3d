# Clean Code

Rules that complement `code-style.md` and catch common React/TS smells during review. Each heading maps to a severity used by the `code-reviewer` agent.

## TypeScript escape hatches (Critical)
Never bypass the type checker silently. `as X`, non-null `!`, `@ts-ignore`, and `@ts-expect-error` must each carry a one-line `// reason: ...` comment explaining why the escape is necessary.
```typescript
// ✓ correct
// reason: library types are wrong — issue #1234
const node = ref.current as HTMLDivElement

// ✗ wrong
const node = ref.current as HTMLDivElement
const value = data!.name
// @ts-ignore
doSomething(x)
```

## State and prop mutation (Critical)
Never mutate props or Redux state. Return new objects/arrays.
```typescript
// ✓ correct
return { ...state, items: [...state.items, item] }

// ✗ wrong
state.items.push(item)
props.user.name = 'x'
```

## Leftover debug artifacts (Critical)
No `console.log`, `console.debug`, `debugger`, or commented-out code in committed diffs. `console.error` is allowed inside `catch`.

## `useEffect` correctness (Critical)
The dependency array must include every reactive value the effect reads. Don't use an effect for values you can derive during render.
```typescript
// ✓ correct — derived in render
const fullName = `${user.first} ${user.last}`

// ✗ wrong — effect syncing derivable state
useEffect(() => setFullName(`${user.first} ${user.last}`), [user])
```

## Single Responsibility (Warning)
A function or component does one thing. Flag functions that mix fetching, transforming, and rendering — split them.

## Mixed abstraction levels (Warning)
Inside one function, don't mix raw API calls or data transformations with UI formatting. Push logic to `utils.ts` as described in `code-style.md`.

## Error handling (Warning)
No empty `catch`. No `catch` that only logs and swallows — rethrow, return a typed error, or surface via the existing error channel.
```typescript
// ✗ wrong
try { await save() } catch (e) {}
try { await save() } catch (e) { console.error(e) }
```

## Comments (Warning)
Comments explain *why*, not *what* — the code already says what. Remove obsolete comments. `TODO`/`FIXME` must include author and ticket:
```typescript
// ✓ correct
// TODO(luan, #4521): replace once backend supports bulk endpoint

// ✗ wrong
// increment i by 1
i += 1
// TODO: fix later
```

## Premature memoization (Warning)
`useMemo` and `useCallback` are only justified when the dependency is expensive to compute or the referential identity matters for a memoized child. Ceremonial use adds noise without benefit.

## Readability (Suggestion)
- Prefer early returns to nested `if`s.
- Avoid double negatives: `if (isReady)` beats `if (!notReady)`.
- Function name must match what it does — `handleClick` shouldn't also save to the server.
- Prop drilling beyond 2 levels when a Redux slice or Jotai atom is available → lift the state.

## Primitive obsession (Suggestion)
3+ related primitives passed together → introduce a typed object.
```typescript
// ✓ correct
function createUser(user: NewUser) { ... }

// ✗ wrong
function createUser(name: string, email: string, phone: string, role: string) { ... }
```
