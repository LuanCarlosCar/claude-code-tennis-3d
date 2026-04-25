# Reusable Components

Always prefer these components over native HTML or custom implementations. Full list lives in `src/components/`.

## Forms & Input
- `import Input, { CurrencyInput } from 'components/Input'` — text and currency inputs with label/error.
- `import TextArea from 'components/TextArea'` — multiline text input with auto-sizing.
- `import ReactSelect from 'components/ReactSelect'` — dropdown select with async/creatable variants.
- `import { CreatableSelect } from 'components/ReactSelectVirtualized'` — virtualized select for large option lists.
- `import CheckBox from 'components/CheckBox'` — labeled checkbox.
- `import RadioCheck from 'components/RadioCheck'` — radio button group.
- `import InputDate from 'components/InputDate'` — inline date picker input.
- `import InputDateModal from 'components/InputDateModal'` — date input that opens a calendar modal.
- `import InputFile from 'components/InputFile'` — styled file upload input.
- `import PasswordInput from 'components/PasswordInput'` — password input with show/hide toggle.
- `import Dropdown from 'components/Dropdown'` — compact dropdown for field-level filters and menus.
- `import MultiToggle from 'components/MultiToggle'` — segmented-button style selector for exclusive options.

## Buttons & Actions
- `import Button from 'components/Button'` — all clickable actions (supports `primary` prop and loading state).
- `import FancyButton from 'components/FancyButton'` — styled gradient button for prominent primary actions.
- `import ToggleIconButton from 'components/ToggleIconButton'` — icon button with toggle state.
- `import { PhotoButton } from 'components/PhotoButton'` — opens the image viewer modal for a dataset photo.
- `import ButtonFilter from 'components/ButtonFilter'` — opens the shared filter modal and shows active-filter badge.
- `import PopupActions from 'components/PopupActions'` — menu of actions triggered from a row or button.

## Layout
- `import Modal from 'components/Modal'` — generic dialog wrapper (use Redux `showModal` to manage instances).
- `import SidePanel from 'components/SidePanel'` — slide-in side panel with compound `.Header`/`.Body` API.
- `import ContentDrawer from 'components/ContentDrawer'` — collapsible content section with toggle header.
- `import SectionCard from 'components/SectionCard'` — titled card container with variant icons.
- `import CardTotal from 'components/CardTotal'` — dashboard card displaying a totalized metric.
- `import HeaderAction from 'components/HeaderAction'` — page header with title and action buttons (requires `padding-top: 4rem` on content).
- `import Navbar from 'components/Navbar'` — main authenticated app navbar.
- `import SimpleNavbar from 'components/SimpleNavbar'` — minimal navbar for public or isolated screens.
- `import Menu from 'components/Menu'` — primary app sidebar menu.
- `import PrintContainer from 'components/PrintContainer'` — wraps content to render a print-friendly report.

## Feedback & Display
- `import Badge from 'components/Badge'` — status/label pill with custom background and color.
- `import InfoBox from 'components/InfoBox'` — informational box with compound `.Row`/`.Icon`/`.Title`/`.Item` API.
- `import StatusBanner from 'components/StatusBanner'` — warning/success/error banner with icon.
- `import HighlightBanner, { HighlightBannerContent } from 'components/HighlightBanner'` — promotional highlight banner.
- `import Information from 'components/Information'` — read-only label/value display.
- `import ShowInfo from 'components/ShowInfo'` — collapsible info tooltip with details.
- `import EmptyMessage from 'components/EmptyState'` — empty state placeholder for lists and tables.
- `import LoadingMsg from 'components/LoadingMsg'` — inline loading indicator with message.
- `import Spinner from 'components/Spinner'` — standalone spinner icon.
- `import Skeleton from 'components/Skeleton'` — skeleton loader block.
- `import LoadingSuspense from 'components/LoadingSuspense'` — full-screen loader used as Suspense fallback.
- `import QuestionMark from 'components/QuestionMark'` — help-icon with tooltip.
- `import Tooltip from 'components/DynamicTooltip'` — globally configurable tooltip (driven by Jotai atom).
- `import { useToasts } from 'react-toast-notifications'` — standard way to show feedback toasts (do NOT use `showAlert` or `react-toastify`).
- `import ToastMessage from 'components/ToastMessage'` — custom toast component used by `react-toast-notifications`.
- `import UpdatingReportMsg from 'components/UpdatingReportMsg'` — banner shown while a report is refreshing.
- `import Span from 'components/Span'` — styled inline text span using theme tokens.

## Lists & Data
- `import List from 'components/List'` — selectable option list with checked state.
- `import ListAttachments from 'components/ListAttachments'` — attachments list with download actions.
- `import TreeView from 'components/TreeView'` — hierarchical tree display with collapsible nodes.
- `import Finder from 'components/Finder'` — tree-based finder/picker screen with header and confirm actions.
- `import ViewMap from 'components/ViewMap'` — Google Maps container for markers and imagery.
- `import ContractFilter from 'components/ContractFilter'` — global contract/dataset selector used in the navbar.
- `import SimpleTable from 'pages/Reports/components/tables/SimpleTable'` — reusable data table with column config, multiline headers, sticky header/first-row/first-column, treeview rows, XLS export, and legend support. Accepts `customStyle` (and `customStyleTableWrapper`) as props for flexible styling without forking the component.

## Utilities
- `import RenderWhen from 'components/RenderWhen'` — conditional rendering for JSX blocks (use instead of `{cond && <X/>}` ternaries when block is multi-line).
- `import RouteGuard from 'components/RouteGuard'` — wraps routes to enforce permission/session checks.
- `import ChunkErrorBoundary from 'components/ChunkErrorBoundary'` — error boundary for lazy-loaded chunk failures.
- `import UrlValidator from 'components/UrlValidator'` — validates token URL params before rendering app.
- `import { printPdf } from 'components/PdfPrinter'` — helper to export the current view as PDF.

## Rule
Never create a native HTML equivalent when one of these components exists. If you need a variant, extend the existing component.
