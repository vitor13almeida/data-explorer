"use client";

import FileCard, { FileCardI } from "@/components/Shared/Card/FileCard";
import StatCard, { StatCardI } from "@/components/Shared/Card/StatsCard";
import { Table } from "@/components/Shared/Table";
import { useResourceContext } from "@/hooks/useResourceContext";
import { fields } from "@/services/consts/structure";
import { DatasetProfile } from "@/services/types";
import { useTranslation } from "react-i18next";

function getScoreStyle(score: number): string {
  if (score >= 0.8) return "bg-success-50 text-success-700";
  if (score >= 0.5) return "bg-warning-50 text-warning-700";
  return "bg-danger-50 text-danger-700";
}

interface ConvertedColumn {
  name: string;
  type: string;
  format: string;
  score: number;
}

function convertColumns(columns: DatasetProfile["columns"]): ConvertedColumn[] {
  return Object.entries(columns).map(([name, def]) => ({
    name: name,
    type: def.python_type,
    format: def.format,
    score: def.score,
  }));
}

export default function StructureView() {
  const { t: te } = useTranslation("explorer");

  const { resourceId, structure } = useResourceContext();

  const { profile, dataset_id } = structure;
  const fieldsData = convertColumns(profile.columns);

  const stats: StatCardI[] = [
    {
      label: te("views.structure.totalItems"),
      value: profile.total_lines.toLocaleString("pt-PT"),
    },
    {
      label: te("views.structure.totalColumns"),
      value: Object.keys(profile.columns).length.toString(),
    },
    {
      label: te("views.structure.categoricalColumns"),
      value: profile.categorical.length.toString(),
    },
  ];

  const ids: FileCardI[] = [
    {
      icon: "agora-line-document",
      label: te("views.structure.resourceId"),
      value: resourceId,
    },
    {
      icon: "agora-line-coins",
      label: te("views.structure.datasetId"),
      value: dataset_id,
    },
  ];

  return (
    <div className="flex flex-col gap-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 pb-32">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        {ids.map((id) => (
          <FileCard key={id.label} {...id} />
        ))}
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            {fields.map((f) => (
              <Table.HeaderCell key={f}>
                {te(`views.structure.fields.${f}`)}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {fieldsData.map((f) => (
            <Table.Row key={`line-${f.name}`}>
              <Table.Cell headerLabel={te("views.structure.fields.name")}>
                {f.name}
              </Table.Cell>
              <Table.Cell headerLabel={te("views.structure.fields.type")}>
                <span className="inline-flex items-center rounded-16 bg-neutral-100 px-8 py-2 text-m-regular text-neutral-600">
                  {f.type}
                </span>
              </Table.Cell>
              <Table.Cell headerLabel={te("views.structure.fields.format")}>
                <span className="inline-flex items-center rounded-16 bg-primary-50 px-8 py-2 text-m-medium text-primary-700">
                  {f.format}
                </span>
              </Table.Cell>
              <Table.Cell headerLabel={te("views.structure.fields.score")}>
                <span
                  className={`inline-flex items-center rounded-16 px-8 py-2 text-m-regular ${getScoreStyle(f.score)}`}
                >
                  {(f.score * 100).toFixed(0)}%
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
