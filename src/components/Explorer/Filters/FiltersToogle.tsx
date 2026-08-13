"use client";

import Button from "@/components/Shared/Button/Button";
import { useResourceContext } from "@/hooks/useResourceContext";
import { useTranslation } from "react-i18next";

export default function FiltersToogle() {
  const { t: te } = useTranslation("explorer");

  const { showFilters, setShowFilters } = useResourceContext();

  const handleToogle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Button
      appearance={"link"}
      hasIcon={true}
      trailingIcon="agora-line-settings"
      trailingIconHover="agora-line-settings"
      title={te("actions.filter")}
      onClick={() => handleToogle()}
    >
      {te("actions.filter")}
    </Button>
  );
}
