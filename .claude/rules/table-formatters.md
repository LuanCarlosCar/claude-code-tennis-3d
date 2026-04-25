# TanStack Table Formatters

## Two types of cell components

### Formatter View (display-only)
Used when the cell just displays data:
```typescript
// src/components/TableReport/formatters/MyFormatter/index.tsx
import { CellContext } from '@tanstack/react-table'

export default function MyFormatterView({ getValue }: CellContext<Row, unknown>) {
  const value = getValue()
  return <span>{value}</span>
}
```

### Formatter Editor (inline editing)
Used when the cell allows editing in-place:
```typescript
export default function MyFormatterEditor({ getValue, row, column, table }: CellContext<Row, unknown>) {
  const value = getValue()
  const { updateData } = table.options.meta as TableMeta

  function handleChange(newValue) {
    updateData(row.index, column.id, newValue)
  }

  return <Input value={value} onChange={e => handleChange(e.target.value)} />
}
```

## Registration
Register in the formatter map — see `table-report-formatter` skill for the full 8-step workflow.
