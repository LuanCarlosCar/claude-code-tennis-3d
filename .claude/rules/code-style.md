# Code Style

## Functions
Always use function declarations, not arrow functions for component-level functions:
```typescript
// ✓ correct
function handleSubmit() { ... }
function MyComponent() { ... }

// ✗ wrong
const handleSubmit = () => { ... }
const MyComponent = () => { ... }
```

Arrow is only acceptable as a short single-expression helper inside a function declaration:
```typescript
// ✓ correct
const renderLabel = () => (isActive ? 'Active' : 'Inactive')

// ✗ wrong — multi-line or top-level arrow
```

## Props
Never destructure props in the signature — destructure in the body:
```typescript
// ✓ correct
function Component(props: Props) {
  const { name, onClick } = props
}

// ✗ wrong
function Component({ name, onClick }: Props) { ... }
```

## One component per file
Each `index.tsx` exports exactly one component. Additional components become subfolders under `components/`.

## Render functions
Functions like `renderXxx()` that return JSX must become subcomponents under `components/`, not helpers inside the parent file.

## File and function size
- JSX > 100 lines → extract a subcomponent
- File > 200 lines → split into subcomponents + `utils.ts`
- Function > 50 lines, > 3 parameters, or > 3 nesting levels → refactor

## Early returns
Merge `if`s that return the same value:
```typescript
// ✓ correct
if (!a || !b) return title

// ✗ wrong
if (!a) return title
if (!b) return title
```

## Naming
- `camelCase` — variables, functions
- `PascalCase` — components, types, interfaces
- `UPPER_SNAKE_CASE` — enum values
- Booleans: `isLoading`, `hasError`, `shouldRender` (not `flag`, `check`)
- All identifiers in **English** — never mix PT/EN:
  ```typescript
  // ✓ correct
  handleSave, isLoading, fetchProjects

  // ✗ wrong
  handleSalvar, isCarregando, fetchObras
  ```

## Component folder structure
Every component lives in its own folder:
```
ComponentName/
├── index.tsx      # the component
├── styles.ts      # styled-components
├── utils.ts       # logic (optional)
├── atoms.ts       # jotai atoms (optional)
└── types.ts       # props and shared types (optional)
```
Keep logic in `utils.ts`, styles in `styles.ts`, local state in `atoms.ts`.

## Maximize logic in `utils.ts`
Push as much TypeScript logic as possible out of `index.tsx` and into `utils.ts`. The component file should focus on JSX and hook wiring — everything else is a candidate for extraction.

Move to `utils.ts`:
- Data transformation, mapping, filtering, sorting
- Validation functions
- Formatters (dates, currency, labels)
- Business rules and conditional logic
- Pure helpers (no hooks, no JSX)
- Event handler bodies that don't touch hooks directly
- Type guards and predicates

Keep in `index.tsx`:
- JSX markup
- Hook calls (`useState`, `useEffect`, `useDispatch`, custom hooks)
- Event handler *shells* that delegate to `utils.ts`

```typescript
// ✓ correct — logic in utils.ts
// utils.ts
export function buildOptions(items: Item[]): Option[] {
  return items.filter(i => i.active).map(i => ({ value: i.id, label: i.name }))
}

// index.tsx
import { buildOptions } from './utils'
function MyComponent(props: Props) {
  const options = buildOptions(props.items)
  return <ReactSelect options={options} />
}

// ✗ wrong — logic inlined in the component
function MyComponent(props: Props) {
  const options = props.items
    .filter(i => i.active)
    .map(i => ({ value: i.id, label: i.name }))
  return <ReactSelect options={options} />
}
```

## useEffect
Never declare functions inside `useEffect`. Define them in `utils.ts` (pure logic) or as named functions in the component body (hook-bound), and only *call* them from the effect.
```typescript
// ✓ correct

useEffect(() => {
  loadProjects()
}, [userId])

function loadProjects() {
  dispatch(fetchProjects(userId))
}


// ✗ wrong — function declared inside the effect
useEffect(() => {
  function loadProjects() {
    dispatch(fetchProjects(userId))
  }
  loadProjects()
}, [userId])

// ✗ wrong — inline async/body logic
useEffect(() => {
  const run = async () => {
    const data = await api.get(...)
    setState(data)
  }
  run()
}, [])
```

## TypeScript
- Never use `any`
- Use named types for function return types — no inline anonymous types:
  ```typescript
  // ✓ correct
  function groupModules(): ModuleCategoryGroup[]

  // ✗ wrong
  function groupModules(): { key: string; label: string }[]
  ```

## Enums and constants
- Status/state values → use a TypeScript enum (name `XxxEnum`, values `UPPER_SNAKE_CASE`)
- No string literals for status fields
- No magic numbers — extract to a named const

## Unused code
Remove unused imports, variables, functions, and types. Do not leave dead code.

## Formatting
- Prettier: single quotes, 2-space indent, trailing commas
- ESLint: Airbnb config + TypeScript rules
- Run `yarn lint` before committing

## Imports
Always use path aliases — never relative paths for src/:
```typescript
// ✓ correct
import Button from 'components/Button'
import { theme } from 'theme'

// ✗ wrong
import Button from '../../../components/Button'
```
