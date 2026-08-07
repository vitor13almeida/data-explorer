# Architecture

An overview of the project structure, how components interconnect, and how data flows from the server to the interface.

## Data flow

Loading an explorer page follows this path:

```
Browser → page.tsx (server) → getStructure (server action) → Tabular API
                                      ↓
                              structure loaded
                                      ↓
                            ExplorerProviders (client)
                            ├── TranslationProvider
                            ├── ResourceProvider
                            │   ├── reads search params from URL
                            │   ├── initializes filters and state
                            │   └── calls getData (server action) → Tabular API
                            └── ChartProvider
                                └── axis state and chart type
```

The structure is fetched on the server because it is required to render the page. If it fails with a 404, it renders the resource not found page. If it fails with another error, it passes the error message to the error boundary. The data is fetched on the client side because it depends on filters, pagination, and sorting controlled by the user.

## Providers

### ResourceProvider

The core provider. Manages all state related to dataset exploration:

- **Data and loading** - `data`, `isLoadingData`, `errorData`
- **Structure** - `structure` (received as a prop from the server)
- **Pagination** - `page` (1-indexed), `pageSize`
- **Sorting** - `sortColumn`, `sortDirection`
- **Filters** - `filters` (UI state), `appliedFilters` (ref containing values sent to the API)
- **Operators** - `filtersOperator`, `appliedFiltersOperator` (same logic)
- **Visible columns** - `headersVisibility`, `appliedHeadersVisibility`

The separation between UI state and applied refs is key: the UI state updates live while the user edits, but API requests only use the ref values, which update when the user clicks "Apply filters". This avoids unnecessary requests during editing.

The URL updates automatically when `page`, `pageSize`, `sortColumn`, or `sortDirection` change, as well as when filters are applied.

It receives `locale` as a prop to pass it to server actions, which require it to return translated error messages.

### ChartProvider

Manages chart-specific state, kept separate from `ResourceProvider` to avoid cluttering the global context:

- **Axes** - `xAxisKey`, `yAxisKeys` (array for multiple datasets), `rAxisKey`
- **Type** - `chart` (Line, Bar, Radar, etc.)
- **Multi-dataset** - `multipleDatasets` (disabled for Doughnut, Pie, and Polar Area)
- **Export** - `chartRef` to capture the canvas and export it as a PNG with a white background
- **Fullscreen** - `chartContainerRef` and `toggleFullscreen` via native Fullscreen API

### TranslationProvider

Initializes `react-i18next` on the client side with the loaded locale and translation resources.

## Shared Components

Components inside `src/components/Shared/` are thin wrappers around the Agora Design System. Each imports the original component and re-exports it, enabling:

- Centralized customizations and overrides
- Consistent imports across the project
- Simplified replacement of the design system in the future

They contain no business logic.

## Server Actions

Server actions in `actions.ts` are `"use server"` functions that perform fetches to the Tabular API. They receive `locale` as their first argument to return translated error messages via `initTranslations`.

```
getData(locale, resourceId, page, pageSize, ...)
  → GET /api/resources/{id}/data/?{queryParams}
  → returns { status, data?, error?, errors? }

getStructure(locale, resourceId)
  → GET /api/resources/{id}/profile/
  → returns { status, data?, error?, errors? }
```

Both handle network errors, 404s, and API validation errors consistently, always returning an object with a `status` field instead of throwing uncaught exceptions. 404 handling is explicit and executed before generic `!response.ok` checks.

## Filter validation

Validation uses Zod and runs on the client before dispatching requests to the API. The `useFilterValidation` hook generates a dynamic schema based on the dataset structure:

1. For each column, it inspects `format` and `python_type` from `structure.profile.columns`
2. `format` takes precedence over `python_type` (e.g., `year` over `int`)
3. `isnull` and `isnotnull` operators accept any value
4. Validation errors are returned per field and rendered directly on the corresponding input
5. Empty strings or `undefined` values are allowed (optional fields)

The reference for supported formats is documented in `docs/data-formats.md`.

## Views

The `Explorer` component uses `ExplorerView` to render the active view:

- **Table** - `TableView` with `TableHeader`, `TableBody`, `TableRowNoResults`
- **Structure** - `StructureView` with stats cards and field lists with confidence scores
- **Metrics** - `MetricsView` with data quality alerts, global summary, and per-column cards
- **Chart** - `ChartView` with `ChartSelectors`, `ChartRenderer`, `ChartPagination`

Available actions (CSV export, chart export, fullscreen) update dynamically depending on the active view.

## Error Handling

The error boundary hierarchy mirrors Next.js route structures:

```
global-error.tsx                         ← root layout errors (includes <html> and <body>)
[locale]/error.tsx                       ← generic localized errors
[locale]/not-found.tsx                   ← localized 404
explorer/[resource_id]/error.tsx         ← explorer errors (displays error.message)
explorer/[resource_id]/not-found.tsx     ← resource not found in API
```

Each boundary catches errors within its route segment and children. Root 404 handling redirects to the correct locale using `Accept-Language` headers or preference cookies.

## Internationalization

The project uses `react-i18next` on the client and `initTranslations` on the server. Configuration is located in `src/config/i18nConfig.ts`. The namespaces are:

- **common** - shared texts (buttons, generic errors, common labels)
- **explorer** - explorer-specific texts (views, filters, metrics, charts, API errors)

Server actions take `locale` as an argument and create their own i18n instance because client-side `t` functions are not serializable and cannot be passed across server boundaries.

## Pagination

The API relies on 1-based pagination (`INITIAL_PAGE = 1`). The Agora Design System table component uses 0-based indexing. Conversion happens in `TableView`:

- `currentPage: page - 1` - passed to component (1-based → 0-based)
- `setPage(tablePage + 1)` - callback received (0-based → 1-based)

`ChartPagination` operates directly with 1-based indexing.

## Documentation

- [README](README.md) - general project overview
- [Architecture](architecture.md) - data flow, providers, server actions, validation, and error handling
- [Data types and formats](data-formats.md) - reference for formats returned by the Tabular API and how they are validated

### Versão em Português

- [README](../../README.md) - descrição geral do projeto
- [Arquitetura](../PT/architecture.md) - fluxo de dados, providers, server actions, validação e gestão de erros
- [Tipos e formatos de dados](../PT/data-formats.md) - referência dos formatos devolvidos pela Tabular API e como são validados
