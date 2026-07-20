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
      iconOnly={true}
      hasIcon={true}
      leadingIcon="agora-line-filter"
      leadingIconHover="agora-line-filter"
      title={te("actions.filter")}
      onClick={() => handleToogle()}
      appearance={showFilters ? "solid" : "outline"}
    />
  );
}
