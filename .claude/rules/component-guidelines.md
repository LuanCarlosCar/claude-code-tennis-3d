# Component Guidelines

## Core rule
NEVER create native HTML elements directly. Always use existing components from `src/components/`.

```typescript
// ✗ NEVER
<input type="text" />
<button onClick={fn}>Save</button>
<select><option>A</option></select>
<textarea />
<div onClick={fn}>Click</div>

// ✓ ALWAYS
<Input label="Name" value={v} onChange={fn} />
<Button text="Save" primary onClick={fn} />
<ReactSelect options={opts} onChange={fn} />
<TextArea label="Notes" value={v} onChange={fn} />
<Button text="Click" onClick={fn} />
```

## Key components
- `Input`, `CurrencyInput` — text/number inputs
- `TextArea` — multiline text
- `ReactSelect`, `AsyncSelect`, `CreatableSelect` — dropdowns
- `CheckBox` — checkbox
- `InputDate` — date picker
- `Button` — all clickable actions
- `Modal` — dialogs
- `RenderWhen` — conditional rendering (replaces ternary for JSX blocks)
- `Badge` — status labels
- `Information`, `ShowInfo` — read-only data display
