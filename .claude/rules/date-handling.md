# Date Handling

Always use the helpers in `utils/date` for formatting and conversion. Never call `moment(...).format(...)` inline — if you need a format that is not listed here, add a new helper in `utils/date.ts` and reuse it.

`moment` is the project's date library. Do NOT introduce `date-fns`, `dayjs`, or native `Intl.DateTimeFormat` — keep one library to avoid bundle bloat and inconsistent results.

## Helpers
- `import { toDateTimeBR } from 'utils/date'` — `DD/MM/YYYY HH:mm:ss`. Returns `null` for falsy input.
- `import { toDateBR } from 'utils/date'` — `DD/MM/YYYY`. Returns `null` for falsy input.
- `import { toDateUS } from 'utils/date'` — `YYYY-MM-DD`. Returns `null` for falsy input. Use when sending dates to the API.
- `import { toTime } from 'utils/date'` — `HH:mm:ss`.
- `import { getUsDateTime } from 'utils/date'` — current local datetime as `YYYY-MM-DD HH:mm:ss`.
- `import { getUtcDatetime } from 'utils/date'` — current UTC datetime as `YYYY-MM-DD HH:mm:ss`.
- `import { removeUtc } from 'utils/date'` — subtracts 3 hours (BRT offset) and returns a `Moment`. Use for display of UTC strings coming from the API.
- `import { toInputDate } from 'utils/date'` — converts to native `Date` for date-picker inputs; returns `undefined` for falsy input.
- `import { convertDateBrToUS } from 'utils/date'` — `DD/MM/YYYY → YYYY-MM-DD`; returns the original string if invalid.

## Input direction
- **API → UI**: strings arrive as `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss`. Format for display with `toDateBR` / `toDateTimeBR`.
- **UI → API**: user picks a date via `InputDate` / `InputDateModal`. Serialize with `toDateUS` before sending; never send `DD/MM/YYYY` to the backend.
- **Form value → picker**: use `toInputDate` to hand a native `Date` to the calendar component.

## Examples
```typescript
// ✓ correct
const label = toDateBR(row.dataCriacao)
const payload = { dataInicio: toDateUS(form.dataInicio) }
const picked = toInputDate(row.dataFim)

// ✗ wrong — inline format
const label = moment(row.dataCriacao).format('DD/MM/YYYY')

// ✗ wrong — mixing libraries
import { format } from 'date-fns'
const label = format(new Date(row.dataCriacao), 'dd/MM/yyyy')

// ✗ wrong — sending BR format to the API
api.post('/x', { dataInicio: toDateBR(form.dataInicio) })
```

## Falsy handling
All formatters return `null` (or `undefined` for `toInputDate`) when the input is falsy — don't wrap calls in extra `if (date)` guards; pass the value straight through.

```typescript
// ✓ correct
<Cell>{toDateBR(row.dataEntrega)}</Cell>

// ✗ wrong — redundant guard
<Cell>{row.dataEntrega ? toDateBR(row.dataEntrega) : null}</Cell>
```

## Rule
Never format or parse dates inline with `moment`. Add a helper in `utils/date.ts` when a new format is needed, and import it everywhere.
