"use client";

import { useTranslation } from "react-i18next";
import { Tabs } from "../Shared/Tabs";
import TableView from "./TabsContent/TableView";

export default function Explorer() {
  const { t: te } = useTranslation("explorer");
  return (
    <Tabs.Root>
      <Tabs.Section>
        <Tabs.Header>{te("tabs.table.title")}</Tabs.Header>
        <Tabs.Body>
          <TableView />
        </Tabs.Body>
      </Tabs.Section>

      <Tabs.Section>
        <Tabs.Header>{te("tabs.structure.title")}</Tabs.Header>
        <Tabs.Body>{te("tabs.structure.title")}...</Tabs.Body>
      </Tabs.Section>

      <Tabs.Section>
        <Tabs.Header>{te("tabs.stats.title")}</Tabs.Header>
        <Tabs.Body>{te("tabs.stats.title")}...</Tabs.Body>
      </Tabs.Section>

      <Tabs.Section>
        <Tabs.Header>{te("tabs.chart.title")}</Tabs.Header>
        <Tabs.Body>{te("tabs.chart.title")}...</Tabs.Body>
      </Tabs.Section>
    </Tabs.Root>
  );
}
