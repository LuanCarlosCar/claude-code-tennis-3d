# Sentry Error Handling

## Rule
Always wrap async operations in try/catch and report unexpected errors to Sentry.

## Pattern (Node.js / AdonisJS)
```typescript
import * as Sentry from '@sentry/node'

async function myOperation() {
  try {
    // ... operation
  } catch (error) {
    Sentry.captureException(error)
    throw error
  }
}
```

## Pattern (React)
```typescript
import * as Sentry from '@sentry/react'

async function myOperation() {
  try {
    // ... operation
  } catch (error) {
    Sentry.captureException(error)
    // handle gracefully in UI
  }
}
```

## What NOT to catch silently
- Never `catch (e) {}` with empty body
- Never `catch (e) { console.log(e) }` without Sentry in production code
- Always re-throw if the caller needs to know about the failure
