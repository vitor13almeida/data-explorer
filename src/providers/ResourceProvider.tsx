"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";

export type ResourceContextType = {
  resourceId: string;
  setResourceId: Dispatch<string>;
  structure: Array<unknown>;
  setStructure: Dispatch<SetStateAction<unknown[]>>;
  data: Array<unknown>;
  setData: Dispatch<SetStateAction<unknown[]>>;
};

export const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [resourceId, setResourceId] = useState<string>("");
  const [structure, setStructure] = useState<Array<unknown>>([]);
  const [data, setData] = useState<Array<unknown>>([]);

  const value = useMemo(
    () => ({
      resourceId,
      setResourceId,
      structure,
      setStructure,
      data,
      setData,
    }),
    [resourceId, structure, data],
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
