# Modal Pattern

## Opening a modal
```typescript
import { useDispatch } from 'react-redux'
import { showModal } from 'store/modal/actions'
import { ModalName } from 'store/modal/types'

const dispatch = useDispatch()
dispatch(showModal(ModalName.YOUR_MODAL, { param1: value }))
```

## Closing a modal
```typescript
import { closeModal } from 'store/modal/actions'
dispatch(closeModal(ModalName.YOUR_MODAL))
```

## Creating a new modal
1. Add to `ModalName` enum in `src/store/modal/types.ts`
2. Create component at `src/components/Modal/YourModalName/index.tsx`
   - Use `useModal<Params>(ModalName.YOUR_MODAL)` to get `{ isOpen, params, windowSec }`
   - Wrap in `<Modal isOpen={isOpen} windowSec={windowSec}>`
   - Use `<ModalHeader>`, `<ModalTitle>`, `<ButtonClose>`, `<ModalContainer>` from `styles/modal`
3. Register in `src/components/Modal/GlobalModalImporter/index.tsx`
