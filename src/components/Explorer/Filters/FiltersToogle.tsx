"use client";

import Button from "@/components/Shared/Button/Button";
import {
  PopupConfiguration,
  usePopupContext,
} from "@ama-pt/agora-design-system";
import { useTranslation } from "react-i18next";
import Filters from "./Filters";

export default function FiltersToogle() {
  const { t } = useTranslation("common");
  const { t: te } = useTranslation("explorer");

  const { show } = usePopupContext();

  const handleShowFilters = () => {
    show(<Filters />, {
      title: te("actions.filter"),
      closeAriaLabel: t("close"),
      dimensions: "l",
    } as PopupConfiguration);
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
