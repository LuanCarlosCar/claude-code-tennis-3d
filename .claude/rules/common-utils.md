# Common Utils

Always prefer these helpers over reimplementing equivalent logic. Before writing a new utility, check this list.

## Async & timing
- `import { sleep } from 'utils/common'` — delay promise (`ms`).

## Arrays & collections
- `import { removeDuplicate } from 'utils/common'` — dedupe array by a key.
- `import { chunkArray } from 'utils/common'` — split array into fixed-size chunks.
- `import { numericArrayOf } from 'utils/common'` — build `[1..N]`.
- `import { normalizeFieldJsonList } from 'utils/common'` — parse a stringified JSON field for each item.
- `import { splitAndTrim } from 'utils/common'` — split + trim + drop empty tokens.

## Objects & JSON
- `import { isObjectEmpty } from 'utils/common'` — true when object has no keys (or falsy).
- `import { isNullOrUndefined } from 'utils/common'` — null/undefined guard.
- `import { jsonParse } from 'utils/common'` — idempotent parse (accepts string or object).
- `import { jsonToCamelCase } from 'utils/common'` — parse + camelCase keys (`deep?` flag).

## Numbers & currency
- `import { currencyToNumber } from 'utils/common'` — `"1,5" → 1.5`.
- `import { dotToComma } from 'utils/common'` — `"1.5" → "1,5"`.
- `import { toRound, toTrunc, toTruncate } from 'utils/common'` — rounding/truncation with `places`.
- `import { formatValueWithDecimals } from 'utils/common'` — fixed-decimals formatter.
- `import { checkOutOfLimit } from 'utils/common'` — outside `[-5, 5]`.
- `import { zeroPad } from 'utils/common'` — left-pad with `0`.
- `import { removeNonNumeric } from 'utils/common'` — strip non-digit chars.

## Strings & validation
- `import { isValidEmail } from 'utils/common'` — email regex check.
- `import { generateUUID } from 'utils/common'` — uuid v1.

## Select & forms
- `import { toSelectOptions } from 'utils/common'` — map list to `{ value, label }[]` using an `OptionsType` key pair.

## URL & navigation
- `import { normalizeParamsUrl } from 'utils/common'` — replace path param placeholder.
- `import { removeTokenParam } from 'utils/common'` — strip `?t=...` from URL.
- `import { preventRelaod } from 'utils/common'` — read `location.state.preventReload` *(note: original typo in name)*.
- `import { getRedirectPathFromLocationState } from 'utils/common'` — extract `from.pathname + from.search` redirect target.

## Environment & device
- `import { getBrowserName, getDevice } from 'utils/common'` — browser name / `desktop|tablet|mobile`.
- `import { isPrdEnvironment, isApiPrd } from 'utils/common'` — env/host checks.
- `import { isGescorpGo } from 'utils/common'` — check `idEmpresa` equals `EnumEnterpise.GESCORP_GO`.

## Sentry
- `import { reportToSentry, shouldIgnore, getSentryErrorsToIgnore } from 'utils/common'` — standard Sentry reporting with tags (`status`, `method`, `api-url`, `base`).

## Dataset fetch (Adonis)
Standard way to query dataset SQL results — do NOT call `apiAdonis.post('/dataset/get-sql-response/...')` directly.

- `import { getSqlResponseAdonis } from 'services/dataset'` — fetches the full result array for a dataset.
  - Signature: `getSqlResponseAdonis<T>(id, params?, disableConvertToCamelcase?, cammelCaseDeep?): Promise<T>`
  - Returns `[] as T` when `id` is falsy.
  - Applies `snakecaseKeys` to `params` and uses `withRetry`.
  - Response keys are camelCased by default (toggle with `disableConvertToCamelcase` / `cammelCaseDeep`).
- `import { getSingleResponseAdonis } from 'services/dataset'` — fetches the first row only (`res[0]`).
  - Signature: `getSingleResponseAdonis<T>(id, params?, disableConvertToCamelcase?): Promise<T>`
  - Returns `{} as T` when `id` is falsy.
  - Use when the dataset is known to return a single record — avoids callers doing `[0]`.

```typescript
// ✓ correct
const rows = await getSqlResponseAdonis<Row[]>(DATASET_ID, { idObra })
const header = await getSingleResponseAdonis<Header>(HEADER_DATASET_ID, { idObra })

// ✗ wrong — reimplementing the call
const rows = await apiAdonis.post(`/dataset/get-sql-response/${DATASET_ID}`, ...)
```

## Rule
Never reimplement a helper that already exists here. If the existing helper is missing a capability, extend it in place rather than creating a parallel utility.
