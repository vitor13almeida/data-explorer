import { ResourceContext } from "@/providers/ResourceProvider";
import { useContext } from "react";

export function useResourceContext() {
  const context = useContext(ResourceContext);

  if (!context) {
    throw new Error('useResourceContext must be used within ResourceDataContext');
  }

  return context;
}
