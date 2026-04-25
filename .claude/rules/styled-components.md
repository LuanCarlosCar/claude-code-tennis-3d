# Styled Components

## The 62.5% trick
`html { font-size: 62.5% }` → `1rem = 10px` in this project (NOT 16px).

| theme token | rem | px |
|---|---|---|
| `theme.space.xs` | 0.4rem | 4px |
| `theme.space.sm` | 0.8rem | 8px |
| `theme.space.md` | 1.2rem | 12px |
| `theme.space.lg` | 1.6rem | 16px |
| `theme.space.xl` | 2rem | 20px |
| `theme.fontSizes.sm` | 1.2rem | 12px |
| `theme.fontSizes.md` | 1.4rem | 14px |
| `theme.fontSizes.lg` | 1.6rem | 16px |

## Always use design tokens
```typescript
// ✓ correct
const Container = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.grey50};
  border-radius: ${({ theme }) => theme.newRadius.md};
  gap: ${({ theme }) => theme.space.sm};
`

// ✗ wrong — hardcoded values
const Container = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #686c73;
  border-radius: 6px;
`
```

## Never use inline styles
```typescript
// ✗ wrong
<div style={{ padding: '10px', color: 'red' }}>

// ✓ correct — create a styled component
```

## Legacy tokens (DO NOT USE in new code)
- `theme.spacing` (tiny/small/medium/large) → use `theme.space`
- `theme.radius` (small/medium/large/huge) → use `theme.newRadius`
