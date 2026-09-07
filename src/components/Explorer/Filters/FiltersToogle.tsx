"use client";

import Button from "@/components/Shared/Button/Button";
import { Typograph } from "@/components/Shared/Typograph/Typograph";
import { ModalConfiguration, useModalContext } from "@ama-pt/agora-design-system";
import { useTranslation } from "react-i18next";
import Filters from "./Filters";

export default function FiltersToogle() {
  const { t } = useTranslation("common");
  const { t: te } = useTranslation("explorer");

  const { show } = useModalContext();

  const handleShowFilters = () => {
    show(
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-64">
        <Typograph tag="h2" className="w-full text-2xl-bold">
          {te("actions.filter")}
        </Typograph>
        <Filters />
      </div>,
      {
        closeButtonLabel: t("close"),
        darkMode: false,
      } satisfies ModalConfiguration
    );
  };

  return (
    <Button
      appearance={"link"}
      hasIcon={true}
      trailingIcon="agora-line-settings"
      trailingIconHover="agora-line-settings"
      title={te("actions.filter")}
      onClick={() => handleShowFilters()}
    >
      {te("actions.filter")}
    </Button>
  );
}
