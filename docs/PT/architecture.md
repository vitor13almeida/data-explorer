# Arquitetura

Visão geral da estrutura do projeto, como os componentes se ligam entre si e como os dados fluem desde o servidor até à interface.

## Fluxo de dados

O carregamento de uma página do explorador segue este percurso:

```
Browser → page.tsx (server) → getStructure (server action) → Tabular API
                                      ↓
                              estrutura carregada
                                      ↓
                            ExplorerProviders (client)
                            ├── TranslationProvider
                            ├── ResourceProvider
                            │   ├── lê search params do URL
                            │   ├── inicializa filtros e estado
                            │   └── chama getData (server action) → Tabular API
                            └── ChartProvider
                                └── estado dos eixos e tipo de gráfico
```

A estrutura é carregada no servidor porque é obrigatória para renderizar a página. Se falhar com 404, mostra a página de recurso não encontrado. Se falhar com outro erro, lança a mensagem para o error boundary. Os dados são carregados no cliente porque dependem de filtros, paginação e ordenação que o utilizador controla.

## Providers

### ResourceProvider

É o provider central. Gere todo o estado da exploração:

- **Dados e loading** - `data`, `isLoadingData`, `errorData`
- **Estrutura** - `structure` (recebida como prop do server)
- **Paginação** - `page` (base 1), `pageSize`
- **Ordenação** - `sortColumn`, `sortDirection`
- **Filtros** - `filters` (estado da UI), `appliedFilters` (ref com os valores enviados à API)
- **Operadores** - `filtersOperator`, `appliedFiltersOperator` (mesma lógica)
- **Colunas visíveis** - `headersVisibility`, `appliedHeadersVisibility`

A distinção entre estado e refs aplicados é importante: o estado da UI muda enquanto o utilizador edita, mas o pedido à API só usa os valores dos refs, que são atualizados quando o utilizador clica em "Aplicar filtros". Isto evita pedidos desnecessários durante a edição.

O URL é atualizado automaticamente quando `page`, `pageSize`, `sortColumn` ou `sortDirection` mudam, e quando os filtros são aplicados.

Recebe o `locale` como prop para o passar às server actions, que precisam dele para devolver mensagens de erro traduzidas.

### ChartProvider

Gere o estado específico do gráfico, separado do ResourceProvider para não poluir o contexto global:

- **Eixos** - `xAxisKey`, `yAxisKeys` (array para múltiplos datasets), `rAxisKey`
- **Tipo** - `chart` (Line, Bar, Radar, etc.)
- **Multi-dataset** - `multipleDatasets` (desativado para Doughnut, Pie, Polar Area)
- **Exportação** - `chartRef` para capturar o canvas e exportar como PNG com fundo branco
- **Fullscreen** - `chartContainerRef` e `toggleFullscreen` via Fullscreen API nativa

### TranslationProvider

Inicializa o `react-i18next` no lado do cliente com o locale e recursos carregados.

## Componentes Shared

Os componentes em `src/components/Shared/` são wrappers finos sobre o Agora Design System. Cada um importa o componente original e re-exporta-o, permitindo:

- Centralizar customizações e overrides
- Manter os imports consistentes no projeto
- Facilitar a substituição do design system no futuro

Não contêm lógica de negócio.

## Server Actions

As server actions em `actions.ts` são funções `"use server"` que fazem fetch à Tabular API. Recebem o `locale` como primeiro argumento para devolver mensagens de erro traduzidas via `initTranslations`.

```
getData(locale, resourceId, page, pageSize, ...)
  → GET /api/resources/{id}/data/?{queryParams}
  → retorna { status, data?, error?, errors? }

getStructure(locale, resourceId)
  → GET /api/resources/{id}/profile/
  → retorna { status, data?, error?, errors? }
```

Ambas tratam erros de rede, 404, e erros de validação da API de forma uniforme, devolvendo sempre um objecto com `status` em vez de lançar exceções. O tratamento de 404 é explícito e anterior à verificação genérica de `!response.ok`.

## Validação de filtros

A validação usa Zod e corre no cliente antes de enviar o pedido à API. O hook `useFilterValidation` constrói um schema dinâmico com base na estrutura do dataset:

1. Para cada coluna, lê o `format` e o `python_type` do `structure.profile.columns`
2. O `format` tem prioridade sobre o `python_type` (ex: `year` sobre `int`)
3. Operadores `isnull` e `isnotnull` aceitam qualquer valor
4. Os erros são devolvidos por campo e mostrados no input correspondente
5. Filtros com valor vazio ou `undefined` são aceites (campos opcionais)

A referência de formatos conhecidos está documentada em `docs/data-formats.md`.

## Vistas

O componente `Explorer` usa um `ExplorerView` que renderiza a vista ativa:

- **Tabela** - `TableView` com `TableHeader`, `TableBody`, `TableRowNoResults`
- **Estrutura** - `StructureView` com cards de stats e lista de campos com score de confiança
- **Métricas** - `MetricsView` com alertas de qualidade, sumário global e cards por coluna
- **Gráfico** - `ChartView` com `ChartSelectors`, `ChartRenderer`, `ChartPagination`

As ações disponíveis (exportar CSV, exportar gráfico, fullscreen) mudam conforme a vista ativa.

## Gestão de erros

A hierarquia de error boundaries segue a estrutura de rotas do Next.js:

```
global-error.tsx                           ← erros no root layout (inclui <html> e <body>)
[locale]/error.tsx                         ← erros genéricos com i18n
[locale]/not-found.tsx                     ← 404 com i18n
explorer/[resource_id]/error.tsx           ← erros do explorador (mostra error.message)
explorer/[resource_id]/not-found.tsx       ← recurso não encontrado na API
```

Cada nível apanha erros do seu segmento e dos filhos. O 404 raiz redireciona para o locale correto usando `Accept-Language` ou cookie de preferência.

## Internacionalização

O projeto usa `react-i18next` no cliente e `initTranslations` no servidor. A configuração está em `src/config/i18nConfig.ts`. Os namespaces são:

- **common** - textos partilhados (botões, erros genéricos, labels comuns)
- **explorer** - textos específicos do explorador (vistas, filtros, métricas, gráficos, erros da API)

As server actions recebem o `locale` como argumento e inicializam a sua própria instância de i18n porque a função `t` do cliente não é serializável e não pode ser passada como argumento.

## Paginação

A API usa paginação base 1 (`INITIAL_PAGE = 1`). A tabela do Agora Design System usa base 0. A conversão é feita no `TableView`:

- `currentPage: page - 1` - ao passar para o componente (base 1 → base 0)
- `setPage(tablePage + 1)` - ao receber o callback (base 0 → base 1)

O `ChartPagination` trabalha directamente em base 1.

## Documentação

- [README](../../README.md) - descrição geral do projeto
- [Arquitetura](architecture.md) - fluxo de dados, providers, server actions, validação e gestão de erros
- [Tipos e formatos de dados](data-formats.md) - referência dos formatos devolvidos pela Tabular API e como são validados

## ENglish Version

- [README](../EN/README) - general project overview
- [Arquitetura](../EN/architecture.md) - data flow, providers, server actions, validation, and error handling
- [Tipos e formatos de dados](../EN/data-formats.md) - reference for formats returned by the Tabular API and how they are validated
