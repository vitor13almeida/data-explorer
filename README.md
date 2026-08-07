# Explorador de Dados Tabulares

Uma aplicação web para explorar, analisar e visualizar dados abertos de forma interativa. Construída com Next.js e pensada para tornar acessível a qualquer pessoa a consulta dos conjuntos de dados disponibilizados no portal dados.gov.pt.

O objetivo é simples: dado um recurso com dados estruturados, permitir que o utilizador os explore de diferentes perspetivas, desde a consulta direta em tabela até à análise visual através de gráficos, passando pela inspeção da estrutura e métricas estatísticas de cada coluna.

## Como funciona

Os dados disponíveis no dados.gov.pt são processados pelo Hydra, um serviço que percorre os conjuntos de dados do portal, analisa a sua estrutura e prepara os dados para consulta. O resultado desse processamento fica acessível através da Tabular API, que expõe os dados já estruturados, com informação sobre tipos de colunas, perfis estatísticos e capacidades de filtragem e ordenação.

Esta aplicação consome a Tabular API e apresenta os dados em quatro vistas complementares. Toda a navegação, filtragem, ordenação e paginação é refletida no URL, permitindo partilhar e guardar o estado exato de uma consulta.

A interface está disponível em português e inglês, adaptando-se automaticamente ao idioma do utilizador.

## Vistas disponíveis

### Tabela

A vista principal. Mostra os dados em formato tabular com paginação, ordenação por coluna e a possibilidade de escolher quais as colunas visíveis. Cada coluna pode ser filtrada individualmente, com operadores que variam consoante o tipo de dados (texto, número, data ou booleano). Os filtros são validados localmente antes de serem enviados à API.

### Estrutura

Apresenta a informação técnica do recurso: número total de registos, identificadores do recurso e do dataset, número de colunas e quantas são categóricas. Abaixo, lista todos os campos com o respetivo formato, tipo de dados e a confiança na deteção automática do tipo.

### Métricas

Mostra um resumo estatístico do recurso e de cada coluna. Começa com um bloco de alertas de qualidade dos dados que destaca automaticamente problemas como colunas com muitos valores em falta, possíveis outliers, colunas com baixa confiança na deteção do tipo e percentagem elevada de registos duplicados. Cada alerta identifica as colunas afetadas. Se não houver problemas, o bloco não aparece.

A nível global, apresenta o número de duplicados, a codificação do ficheiro e o separador utilizado. Por coluna, mostra valores distintos, valores em falta, e para colunas numéricas inclui o mínimo, máximo, média e desvio padrão. As colunas categóricas mostram os valores mais frequentes com barras proporcionais e, quando têm poucos valores únicos, listam-nos como badges.

### Gráfico

Permite visualizar os dados num de oito tipos de gráfico: linha, barras, radar, anel, área polar, bolhas, circular e dispersão. O utilizador escolhe as colunas para os eixos e, nos tipos de gráfico que o suportam, pode selecionar múltiplas colunas no eixo Y para sobrepor datasets no mesmo gráfico, cada um com uma cor distinta da paleta. Nos gráficos proporcionais (anel, circular e área polar) a seleção é limitada a uma coluna.

Inclui paginação própria, exportação do gráfico como imagem PNG e modo de ecrã inteiro para apresentações ou análise detalhada.

## Funcionalidades

- Filtragem por coluna com operadores específicos por tipo de dados (contém, igual, diferente, maior, menor, nulo, entre outros)
- Validação dos filtros com Zod antes do envio à API
- Ordenação por qualquer coluna, refletida no URL
- Paginação com controlo do número de itens por página
- Visibilidade de colunas configurável
- Exportação dos dados visíveis para ficheiro CSV
- Exportação do gráfico como imagem PNG
- Comparação de múltiplas colunas no mesmo gráfico
- Modo de ecrã inteiro para gráficos
- Alertas automáticos de qualidade dos dados
- Estado completo da consulta persistido no URL (filtros, ordenação, página, colunas visíveis)
- Interface bilingue em português e inglês
- Páginas de erro dedicadas para recursos não encontrados e erros genéricos
- Design responsivo que se adapta a dispositivos móveis e desktop

## Arquitetura

O fluxo de dados segue este caminho:

1. O Hydra percorre os conjuntos de dados publicados no dados.gov.pt, analisa a estrutura de cada recurso e processa os dados para consulta
2. A Tabular API disponibiliza os dados processados pelo Hydra, expondo endpoints para consulta de dados, estrutura e perfil estatístico de cada recurso
3. Esta aplicação consome a Tabular API no lado do servidor (para a estrutura) e no lado do cliente (para os dados), apresentando tudo numa interface interativa

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 3
- Chart.js com react-chartjs-2
- Zod 4 para validação
- react-i18next para internacionalização
- Agora Design System

## Documentação

- [README](docs/EN/README.md) - descrição geral do projeto
- [Arquitetura](docs/PT/architecture.md) - fluxo de dados, providers, server actions, validação e gestão de erros
- [Tipos e formatos de dados](docs/PT/data-formats.md) - referência dos formatos devolvidos pela Tabular API e como são validados

## ENglish Version

- [README](docs/EN/README) - general project overview
- [Arquitetura](docs/EN/architecture.md) - data flow, providers, server actions, validation, and error handling
- [Tipos e formatos de dados](docs/EN/data-formats.md) - reference for formats returned by the Tabular API and how they are validated
