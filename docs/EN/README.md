# Tabular Data Explorer

A web application for interactively exploring, analyzing, and visualizing open data. Built with Next.js and designed to make dataset consultation from the dados.gov.pt portal accessible to anyone.

The goal is simple: given a structured data resource, allow users to explore it from different perspectives-ranging from direct table view queries to visual analysis via charts, structural inspection, and statistical metrics per column.

## How it works

The data available on dados.gov.pt is processed by Hydra, a service that crawls datasets on the portal, analyzes their structure, and prepares the data for querying. The result of this processing is made accessible through the Tabular API, which exposes already-structured data along with column type information, statistical profiles, and filtering/sorting capabilities.

This application consumes the Tabular API and presents the data across four complementary views. All navigation, filtering, sorting, and pagination state is reflected in the URL, allowing exact query states to be saved and shared.

The interface is available in Portuguese and English, adapting automatically to the user's language preference.

## Available views

### Table

The primary view. Displays data in a tabular format featuring pagination, column sorting, and configurable column visibility. Each column can be filtered individually using operators tailored to its data type (text, number, date, or boolean). Filters are validated locally before being sent to the API.

### Structure

Presents technical information about the resource: total number of records, resource and dataset identifiers, column count, and the number of categorical columns. Below, it lists all fields alongside their respective format, data type, and confidence score for automatic type detection.

### Metrics

Provides a statistical summary of the resource and each column. It begins with a data quality alert block that automatically highlights issues such as columns with high rates of missing values, potential outliers, low confidence in type detection, and high percentages of duplicate records. Each alert identifies the affected columns. If no issues are detected, the block is hidden.

At the global level, it displays duplicate counts, file encoding, and the delimiter used. Per column, it shows distinct values, missing values, and-for numerical columns-minimum, maximum, mean, and standard deviation. Categorical columns display the most frequent values with proportional bar indicators and, when containing few unique values, list them as badges.

### Chart

Allows data visualization across one of eight chart types: line, bar, radar, doughnut, polar area, bubble, pie, and scatter. Users select columns for the axes and, for supported chart types, can select multiple Y-axis columns to overlay datasets on the same chart, each assigned a distinct palette color. For proportional charts (doughnut, pie, and polar area), selection is limited to a single column.

Includes dedicated pagination, chart export as PNG images, and a full-screen mode for presentations or detailed analysis. The chart configuration (type, selected axes) is persisted in the URL, allowing a specific visualization to be shared.

## Features

- Column-level filtering with type-specific operators (contains, equals, does not equal, greater than, less than, null, between, among others)
- Filter validation using Zod prior to sending API requests
- Sorting by any column, fully reflected in the URL
- Pagination with customizable items per page
- Configurable column visibility
- Visible data export to CSV or JSON files
- Chart export as PNG image
- Multi-column comparison on the same chart
- Full-screen mode for charts
- Automatic data quality alerts
- Complete query state persisted in the URL (active view, filters, sorting, page, visible columns, chart configuration)
- Bilingual interface in Portuguese and English
- Dedicated error pages for non-existent resources and generic errors
- Responsive design adapting seamlessly to mobile and desktop devices

## Architecture

The data flow follows this sequence:

1. Hydra crawls datasets published on dados.gov.pt, analyzes the structure of each resource, and processes data for querying
2. The Tabular API exposes the processed data, serving endpoints for querying data, structure, and statistical profiles for each resource
3. This application consumes the Tabular API server-side (for structure) and client-side (for data), presenting everything within an interactive interface

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 3
- Chart.js with react-chartjs-2
- Zod 4 for validation
- react-i18next for internationalization
- Agora Design System

## Documentation

- [README](README.md) - general project overview
- [Architecture](architecture.md) - data flow, providers, server actions, validation, and error handling
- [Data types and formats](data-formats.md) - reference for formats returned by the Tabular API and how they are validated

### Versão em Português

- [README](../../README.md) - descrição geral do projeto
- [Arquitetura](../PT/architecture.md) - fluxo de dados, providers, server actions, validação e gestão de erros
- [Tipos e formatos de dados](../PT/data-formats.md) - referência dos formatos devolvidos pela Tabular API e como são validados
