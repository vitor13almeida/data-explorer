# Tipos e Formatos de Dados

Referência dos valores de `python_type` e `format` encontrados nos perfis de dados devolvidos pela Tabular API. Serve para comparar com novos formatos que possam aparecer e garantir que o validador e os componentes de filtro os suportam.

## Combinações encontradas

| python_type | format                    | Validação aplicada                   | Placeholder           | Exemplo                 |
| ----------- | ------------------------- | ------------------------------------ | --------------------- | ----------------------- |
| `string`    | `string`                  | Texto livre                          | —                     | Denominaca, Tipo        |
| `string`    | `url`                     | Texto livre                          | `https://...`         | Website                 |
| `string`    | `email`                   | Texto livre                          | `user@example.com`    | email                   |
| `string`    | `latlon_wgs`              | Texto livre                          | `lat,lon`             | Localização Geográfica  |
| `string`    | `latitude_wgs`            | Texto livre                          | `lat`                 | Localização Geográfica  |
| `string`    | `longitude_wgs`           | Texto livre                          | `lon`                 | Localização Geográfica  |
| `string`    | `pays`                    | Texto livre                          | —                     | NUTS0_desig             |
| `string`    | `iso_country_code_alpha2` | Máximo 2 caracteres                  | `PT`                  | NUTS0_codigo            |
| `int`       | `int`                     | Número inteiro (`^-?\d+$`)           | `0`                   | OBJECTID, codigo_rua    |
| `int`       | `year`                    | 4 dígitos, range 1900-2100           | `YYYY`                | ano                     |
| `float`     | `float`                   | Número decimal (`^-?\d+([.,]\d+)?$`) | `0.00`                | ShapeSTLength, Peso     |
| `date`      | `date`                    | Formato `YYYY-MM-DD`                 | `YYYY-MM-DD`          | data_actualizacao, Data |
| `datetime`  | `datetime_naive`          | Formato `YYYY-MM-DDTHH:MM:SS`        | `YYYY-MM-DDTHH:MM:SS` | criacaodtt              |
| `bool`      | `bool`                    | `true` / `false` / `null`            | TriStateInput         | extensao                |

## Validação condicional por operador

Alguns formatos alteram a validação conforme o operador de filtro selecionado:

| format           | Operador | Validação                                                        |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `datetime_naive` | `exact`  | Formato completo obrigatório: `YYYY-MM-DDTHH:MM:SS`              |
| `datetime_naive` | outros   | Aceita `YYYY-MM-DD`, `YYYY-MM-DDTHH:MM` ou `YYYY-MM-DDTHH:MM:SS` |

## Formatos sem validação específica

Estes formatos aparecem no campo `format` mas são tratados como texto livre, sem validação adicional:

| format       | python_type base | Motivo                                           |
| ------------ | ---------------- | ------------------------------------------------ |
| `url`        | `string`         | Filtro usa operador "contém", aceita texto livre |
| `email`      | `string`         | Filtro usa operador "contém", aceita texto livre |
| `latlon_wgs` | `string`         | Filtro usa operador "contém", aceita texto livre |
| `pays`       | `string`         | Nome de país, aceita texto livre                 |

## Formatos encontrados apenas em columns_fields e columns_labels

Estes formatos aparecem em `columns_fields` ou `columns_labels` mas não em `columns` (o campo usado para validação). Documentados para referência:

| format            | Contexto       |
| ----------------- | -------------- |
| `longitude_l93`   | columns_fields |
| `latitude_wgs`    | columns_fields |
| `longitude_wgs`   | columns_fields |
| `mongo_object_id` | columns_labels |
| `code_region`     | columns_labels |
| `code_rna`        | columns_labels |
| `insee_ape700`    | columns_labels |
| `uai`             | columns_labels |

## Como adicionar novos formatos

Quando um novo valor de `format` ou `python_type` aparecer na API:

1. Adicionar à tabela acima
2. Avaliar se precisa de validação específica no `useFilterValidation.ts` (switch por `format`)
3. Se sim, adicionar o regex e a chave i18n da mensagem de erro
4. Avaliar se precisa de placeholder no `Filter.tsx` (função `getInputType`)
5. Avaliar se precisa de tipo de input diferente (ex: date picker, toggle)
6. Avaliar se precisa de operadores específicos no `getOperatorOptions` em `data.ts`
