---
name: table-report-formatter
description: Create Table Report formatters (view and editor) for the TanStack table system. Use this skill when the user asks to create a new formatter, cell renderer, or editor for the Table Report. A "Formatter View" is a display-only cell component (no text/number input) — follow the OpenGenericDynamicForm pattern with row-level visibility and actions. A "Formatter Editor" is an inline editable cell with text or currency input — follow the TanStack VariableValueEditor pattern. Triggers on requests like "create a formatter", "add a new cell renderer", "create a table editor", "new table report column formatter".
---

# Table Report Formatter Creation

Two types of Table Report formatters:

1. **Formatter View** — Display-only cell. No text/number input. Opens modals, shows icons, renders values. Uses row-level visibility and the action system for per-scenario behavior.
2. **Formatter Editor** — Inline editable cell. Has text input or currency input. Saves on blur/Enter.

## Decision Rule

- Cell **does NOT** have a text or number input → **Formatter View**
- Cell **has** a text or number input → **Formatter Editor**

---

## Formatter View

Display-only formatters live in `src/pages/TableReport/components/Formatters/`.

### File Structure

```
src/pages/TableReport/components/Formatters/YourFormatterName/
├── index.tsx
├── styles.ts
├── types.ts          (optional)
├── utils.ts          (optional)
└── actions/
    ├── index.ts      (action registry + executeAction)
    └── utils/
        └── yourActionHandler.ts
```

### Row-Level Visibility

Use `keyRefVisibleValue` from `formatterParams` to control per-row rendering. The formatter should render custom content only when the row meets the visibility condition, and fall back to plain value display otherwise.

```tsx
const { keyRefVisibleValue } = formatterParams;

// Row is visible when:
// 1. keyRefVisibleValue is set AND the row has a truthy value for that key
// 2. OR keyRefVisibleValue is not set (show for all rows)
const isVisible =
  (keyRefVisibleValue && row[keyRefVisibleValue]) || !keyRefVisibleValue;

if (isVisible) {
  // Render custom cell (clickable, with icon, etc.)
  return <Cell onClick={handleClick}>{calcValue}</Cell>;
}

// Fallback: plain value, no interaction
return <Cell>{calcValue}</Cell>;
```

This allows the same formatter to behave differently per row based on data — e.g., only show a clickable icon on rows that have a specific flag set.

### Action System

The action system allows a **single formatter to handle multiple scenarios**. Instead of creating a separate formatter for each use case, define different actions and route to the correct handler via `formatterParams.actionType`.

#### Action Registry: `actions/index.ts`

```tsx
import { State } from 'components/Widgets/DynamicForm/types';
import { Column } from 'react-data-grid';
import { AddToast } from 'react-toast-notifications';
import { Contract, TableTreeviewRow } from 'store/types';
import { UserState } from 'store/user/types';
import { yourFirstAction } from './utils/yourFirstAction';
import { yourSecondAction } from './utils/yourSecondAction';

// Register all actions for this formatter
export const Actions = {
  yourFirstAction: yourFirstAction,
  yourSecondAction: yourSecondAction,
};

// Type-safe action keys
export type ActionType = keyof typeof Actions;

export function executeAction(
  form: State,
  currentRow: TableTreeviewRow,
  rowsToSave: TableTreeviewRow[],
  column: Column<any>,
  user: UserState,
  contract: Contract,
  addToast: AddToast,
  dispatch: any,
  actionType: ActionType,
) {
  return Actions[actionType](
    form,
    currentRow,
    rowsToSave,
    column,
    user,
    contract,
    addToast,
    dispatch,
  );
}
```

#### Action Handler: `actions/utils/yourFirstAction.ts`

Each action handler follows the same signature. Customize the data processing and API calls for each scenario.

```tsx
import { State } from 'components/Widgets/DynamicForm/types';
import { Column } from 'react-data-grid';
import { AddToast } from 'react-toast-notifications';
import { Contract, TableTreeviewRow } from 'store/types';
import { UserState } from 'store/user/types';
import { compareKeys } from 'utils/treeview';
import { bulkInsertOrUpdate } from 'services/relationship_variable';
import { getSqlResponseAdonis } from 'services/dataset';

export async function yourFirstAction(
  form: State,
  currentRow: TableTreeviewRow,
  rowsToSave: TableTreeviewRow[],
  column: Column<any>,
  user: UserState,
  contract: Contract,
  addToast: AddToast,
  dispatch: any,
) {
  // 1. Filter relevant rows
  const filteredRows = rowsToSave.filter(item =>
    compareKeys(item.key, currentRow.key),
  );

  if (!filteredRows.length) {
    addToast('No rows found for this action', { appearance: 'warning' });
    return;
  }

  // 2. Fetch previous data if needed
  // const previousData = await getSqlResponseAdonis(PROC_ID, params);

  // 3. Normalize data for save
  const normalizedData = filteredRows.map(row => ({
    // Map to your API payload shape
  }));

  // 4. Save
  await bulkInsertOrUpdate(normalizedData);

  addToast('Saved successfully', { appearance: 'success' });
}
```

#### Using Actions in the Formatter

The formatter reads `actionType` from `formatterParams` and calls `executeAction` with the corresponding action. This means the **same formatter component** serves multiple column configs — each config specifies which action to run.

```tsx
import { executeAction, ActionType } from './actions';

export default function YourFormatterName(props: FormatterProps): ReactElement {
  const dispatch = useDispatch();
  const { row, column, value } = props;
  const { getRows, rows } = useDynamicTable();
  const user = useUser();
  const contract = useContract();
  const { addToast } = useToasts();
  const { formatterParams } = column;

  async function onSaveAction(form: State) {
    await executeAction(
      form,
      row,
      rows,
      column,
      user,
      contract,
      addToast,
      dispatch,
      formatterParams.actionType as ActionType,
    );

    dispatch(closeModal());
    getRows();
  }

  // ...
}
```

#### Column Config with Different Actions

The same formatter, different behavior per column:

```tsx
// Column A — uses action "yourFirstAction"
{
  key: 'column_a',
  formatter: 'renderYourFormatterName',
  formatterParams: {
    actionType: 'yourFirstAction',
    keyRefVisibleValue: 'flagShowColumnA',
    icon: 'edit',
    title: 'Edit Column A',
  },
}

// Column B — same formatter, different action
{
  key: 'column_b',
  formatter: 'renderYourFormatterName',
  formatterParams: {
    actionType: 'yourSecondAction',
    keyRefVisibleValue: 'flagShowColumnB',
    icon: 'info',
    title: 'View Column B',
  },
}
```

### Complete Formatter View Template: index.tsx

```tsx
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { FormatterProps } from '../types';
import { formatNumber } from 'pages/Reports/utils/dataFunctions';
import { useDynamicTable } from '../../../contexts/DynamicTable';
import { showModal, closeModal } from 'store/modal/actions';
import { ModalName } from 'store/modal/types';
import useUser from 'hooks/use-user';
import useContract from 'hooks/use-contract';
import { useToasts } from 'react-toast-notifications';
import { EditIcon, InfoIcon } from 'styles/icons';
import { State } from 'components/Widgets/DynamicForm/types';
import { executeAction, ActionType } from './actions';
import { Cell, CellMutilValue, IconFile } from './styles';

export default function YourFormatterName(
  props: FormatterProps,
): ReactElement {
  const dispatch = useDispatch();
  const { row, column, value } = props;
  const { getRows, rows } = useDynamicTable();
  const user = useUser();
  const contract = useContract();
  const { addToast } = useToasts();
  const { formatterParams } = column;

  const calcValue = formatNumber(column?.numberFormatting)(value);

  function handleClick() {
    const { keyRefVisibleValue, keyRefAction } = formatterParams;

    if (keyRefVisibleValue && !row[keyRefVisibleValue] && !row[keyRefAction]) {
      return;
    }

    // Open modal, trigger side effect, etc.
    dispatch(
      showModal(ModalName.DYNAMIC_FORM_MODAL, {
        title: formatterParams.title,
        // ... modal params
        onFormSaveFromParent: onSaveAction,
      }),
    );
  }

  async function onSaveAction(form: State) {
    await executeAction(
      form,
      row,
      rows,
      column,
      user,
      contract,
      addToast,
      dispatch,
      formatterParams.actionType as ActionType,
    );

    dispatch(closeModal());
    getRows();
  }

  function getIcon() {
    if (!formatterParams?.icon) return <></>;
    if (formatterParams.icon === 'file') return <IconFile />;
    if (formatterParams.icon === 'info') return <InfoIcon color="#b3b3b3" />;
    if (formatterParams.icon === 'edit') return <EditIcon color="#b3b3b3" />;
    return <IconFile />;
  }

  // Row-level visibility check
  const { keyRefVisibleValue } = formatterParams;
  const isVisible =
    (keyRefVisibleValue && row[keyRefVisibleValue]) || !keyRefVisibleValue;

  if (isVisible) {
    if (formatterParams?.hideValue) {
      return <Cell onClick={handleClick}>{getIcon()}</Cell>;
    }

    if (formatterParams?.hideIcon) {
      return <Cell onClick={handleClick}>{calcValue}</Cell>;
    }

    return (
      <CellMutilValue onClick={handleClick}>
        <div>{calcValue}</div>
        {getIcon()}
      </CellMutilValue>
    );
  }

  return <Cell>{calcValue}</Cell>;
}
```

### Template: styles.ts

```tsx
import { GiPaperClip } from 'react-icons/gi';
import styled from 'styled-components';

export const Cell = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

export const IconFile = styled(GiPaperClip)`
  font-size: 1.6rem;
  color: #000;
  cursor: pointer;
`;

export const CellMutilValue = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  justify-content: center;
  cursor: pointer;
`;
```

### Registration

Register in `src/pages/TableReport/components/Formatters/index.ts`:

```tsx
import YourFormatterName from './YourFormatterName';

const formatters = {
  // ... existing
  renderYourFormatterName: YourFormatterName,
};
```

Key format: `render{ComponentName}`.

---

## Formatter Editor

Inline editors for TanStack live in `src/pages/TableReport/components/TanStackTable/components/formatters/`.

### File Structure

```
src/pages/TableReport/components/TanStackTable/components/formatters/YourEditorName/
├── index.tsx
├── styles.ts
└── utils.ts     (optional, save logic)
```

### Template: Currency Editor (index.tsx)

```tsx
import React, { useState, useCallback } from 'react';
import { Cell, Column } from '@tanstack/react-table';
import { Currency, TableTreeviewRow } from 'store/types';
import { currencyToNumber } from 'utils/common';
import { StyledInput } from './styles';
import { useDynamicTable } from 'pages/TableReport/contexts/DynamicTable';
import { saveData } from './utils';

interface YourEditorNameProps {
  cell: Cell<TableTreeviewRow, unknown>;
  column: Column<TableTreeviewRow>;
  onExitEdit?: () => void;
}

interface ColumnType {
  key: string;
  numberFormatting?: { style: string };
}

function getPreviousName(column: ColumnType) {
  return `previous_${column.key}`;
}

export default function YourEditorName(props: YourEditorNameProps) {
  const { cell, column, onExitEdit } = props;
  const originalColumn = column.columnDef?.meta?.originalColumn as ColumnType;
  const initialValue = cell.getValue();
  const { rows, getRows } = useDynamicTable();
  const rowData = cell.row.original;

  const [value, setValue] = useState<Currency>(
    currencyToNumber(initialValue) || 0,
  );

  const [previousValue] = useState(() => {
    const previousFieldPropName = getPreviousName(originalColumn);
    return rowData[previousFieldPropName] || initialValue;
  });

  const handleValueChange = useCallback((newValue: Currency) => {
    setValue(newValue);
  }, []);

  async function handleBlur() {
    const newRows = [...rows];
    const processedValue = currencyToNumber(value);
    const previousFieldPropName = getPreviousName(originalColumn);

    newRows[cell.row.index] = {
      ...newRows[cell.row.index],
      ...rowData,
      [originalColumn.key]: processedValue,
      [previousFieldPropName]: previousValue,
    };

    await saveData(newRows, cell.row.index, getRows);
    onExitEdit?.();
  }

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }, []);

  return (
    <StyledInput
      autoFocus
      id={originalColumn.key}
      name={originalColumn.key}
      defaultValue={value}
      allowNegativeValue={false}
      decimalScale={2}
      decimalSeparator=","
      groupSeparator="."
      onValueChange={handleValueChange}
      intlConfig={{ locale: 'pt-br' }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}
```

### Template: Currency Editor (styles.ts)

```tsx
import styled from 'styled-components';
import { CurrencyInput } from 'components/Input';

export const StyledInput = styled(CurrencyInput)`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  padding: 8px;
  font-size: 1rem;
  background-color: #fff;

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: -2px;
  }
`;
```

### Template: Text Editor (index.tsx)

```tsx
import React, { useState, useCallback } from 'react';
import { Cell, Column } from '@tanstack/react-table';
import { TableTreeviewRow } from 'store/types';
import { StyledInput } from './styles';
import { useDynamicTable } from 'pages/TableReport/contexts/DynamicTable';
import { saveData } from './utils';

interface YourEditorNameProps {
  cell: Cell<TableTreeviewRow, unknown>;
  column: Column<TableTreeviewRow>;
  onExitEdit?: () => void;
}

function getPreviousName(column: { key: string }) {
  return `previous_${column.key}`;
}

export default function YourEditorName(props: YourEditorNameProps) {
  const { cell, column, onExitEdit } = props;
  const originalColumn = column.columnDef?.meta?.originalColumn as {
    key: string;
  };
  const initialValue = cell.getValue() || '';
  const { rows, setRows } = useDynamicTable();

  const [value, setValue] = useState<string>(initialValue);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    [],
  );

  async function handleBlur() {
    const newRows = [...rows];
    const previousFieldPropName = getPreviousName(originalColumn);

    newRows[cell.row.index] = {
      ...newRows[cell.row.index],
      [originalColumn.key]: value,
      [previousFieldPropName]: initialValue,
    };

    const currentRows = await saveData(newRows, cell.row.index);
    setRows(currentRows);
    onExitEdit?.();
  }

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }, []);

  return (
    <StyledInput
      autoFocus
      id={originalColumn.key}
      name={originalColumn.key}
      value={value}
      onChange={handleValueChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}
```

### Template: Text Editor (styles.ts)

```tsx
import styled from 'styled-components';
import Input from 'components/Input';

export const StyledInput = styled(Input)`
  width: 100%;
  height: 100%;
  border: none;
  padding: 8px;
  font-size: 14px;

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: -2px;
  }
`;
```

### Template: Save Utility (utils.ts)

```tsx
import store from 'store';
import { showModal, closeModal } from 'store/modal/actions';
import { ModalName } from 'store/modal/types';
import { TableTreeviewRow } from 'store/types';
import { bulkInsertOrUpdate } from 'services/relationship_variable';

export async function saveData(
  rowsInTable: TableTreeviewRow[],
  editedRowIndex: number,
  getRows: () => TableTreeviewRow[],
) {
  const currentRowEdited = rowsInTable[editedRowIndex];

  store.dispatch(showModal(ModalName.LOADING, { text: 'Salvando...' }));

  try {
    const normalizedDataToSave = {
      id: currentRowEdited.idRelacionamento || null,
      idContrato: currentRowEdited.idContrato,
      idVariavel: currentRowEdited.idVariavel,
      valor: currentRowEdited.valor,
    };

    await bulkInsertOrUpdate([normalizedDataToSave]);

    store.dispatch(closeModal(ModalName.LOADING));
    return getRows();
  } catch (error) {
    store.dispatch(closeModal(ModalName.LOADING));
    console.error('Error saving editor data:', error);
    throw error;
  }
}
```

### Registration (TanStack Editors)

Register in both files:

**TanStack**: `src/pages/TableReport/components/TanStackTable/components/formatters/index.ts`

```tsx
import YourEditorName from './YourEditorName';

export const editors = {
  // ... existing
  renderYourEditorName: YourEditorName,
};
```

**Legacy**: `src/pages/TableReport/components/Formatters/index.ts`

```tsx
const editors = {
  // ... existing
  renderYourEditorName: YourEditorName,
};
```

---

## How FormatterAdapter Connects Everything

The `FormatterAdapter` at `src/pages/TableReport/components/TanStackTable/components/FormatterAdapter/index.tsx` bridges TanStack columns to formatter/editor components:

1. Column config has `formatter` (view) and `editFormatter` (editor) string keys
2. FormatterAdapter looks up the component by key from the registries
3. **View mode**: renders the formatter with `FormatterProps` (`value`, `column`, `row`)
4. **Edit mode**: on cell click (if `hasEditor`), switches to editor with `cell`, `column`, `onExitEdit` props

### Column Configuration Examples

```tsx
// View-only with action system
{
  key: 'my_column',
  formatter: 'renderYourFormatterName',
  formatterParams: {
    actionType: 'yourFirstAction',
    keyRefVisibleValue: 'flagShowThisColumn',
    icon: 'edit',
    title: 'My Column',
  },
}

// Editable column
{
  key: 'my_editable_column',
  name: 'My Editable Column',
  formatter: 'renderDefault',
  editFormatter: 'renderYourEditorName',
}
```

---

## Checklist

- [ ] Correct directory (Formatters/ for view, TanStackTable/components/formatters/ for editor)
- [ ] File structure: `index.tsx` + `styles.ts` (+ optional `utils.ts`, `types.ts`, `actions/`)
- [ ] Props match expected pattern (`FormatterProps` for view, `cell/column/onExitEdit` for editor)
- [ ] Registered in the appropriate `index.ts` with `render{Name}` key
- [ ] Uses `useDynamicTable()` for accessing/updating rows
- [ ] **View**: row-level visibility via `keyRefVisibleValue` condition
- [ ] **View**: action system with `actions/index.ts` registry if formatter handles multiple scenarios
- [ ] **Editor**: saves on blur and Enter key
- [ ] **Editor**: calls `onExitEdit?.()` after save
- [ ] Styled components use `components/Input` or `components/Input/CurrencyInput` — never native HTML inputs
